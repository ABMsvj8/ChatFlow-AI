'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, User, Mail, Bell, Shield, Globe, Moon, Save } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notifications: true,
    darkMode: false,
    language: 'en',
    timezone: 'America/New_York',
  })

  const supabase = createClient()

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }

      setUser(session.user)
      
      // Load user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setFormData({
        name: profile?.full_name || session.user.user_metadata?.full_name || '',
        email: session.user.email || '',
        notifications: profile?.notifications_enabled ?? true,
        darkMode: false, // TODO: Load from user preferences
        language: profile?.language || 'en',
        timezone: profile?.timezone || 'America/New_York',
      })

      setLoading(false)
    }

    loadUser()
  }, [supabase, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: formData.name,
          notifications_enabled: formData.notifications,
          language: formData.language,
          timezone: formData.timezone,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      // Show success message (could add toast)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      {/* Back Button */}
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and profile</p>
      </div>

      <div className="max-w-3xl space-y-8">
        {/* Profile Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <p className="text-gray-600 text-sm">Update your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
              <p className="text-gray-600 text-sm">Configure your app preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email updates about your agents</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, darkMode: !formData.darkMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.darkMode ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Language Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            {/* Timezone Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
              <p className="text-gray-600 text-sm">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 transition-all">
              Change Password
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 transition-all">
              Two-Factor Authentication
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 transition-all">
              Delete Account
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg btn-primary-gradient hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 font-medium transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}