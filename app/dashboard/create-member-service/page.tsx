'use client'

import { useState, useTransition } from "react"
import { InsertMemberAndService } from "./action"

export default function DormCreatePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<'member' | 'service'>("member")

  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!email || !password || !name) {
      setMessage({ type: 'error', text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' })
      return
    }

    startTransition(async () => {
      try {
        await InsertMemberAndService(email, password, role, name)
        setMessage({ type: 'success', text: 'สร้างบัญชีผู้ใช้เรียบร้อยแล้ว' })
        // Reset Form
        setEmail("")
        setPassword("")
        setName("")
      } catch (err) {
        setMessage({ type: 'error', text:( err as Error).message || 'เกิดข้อผิดพลาดในการลงทะเบียน' })
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">เพิ่มบัญชีผู้ใช้งาน</h1>
          <p className="text-sm text-gray-500 mt-2">กรอกข้อมูลเพื่อลงทะเบียนในระบบ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Selection (ประเภทบัญชี) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประเภทบัญชี (Role)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('member')}
                disabled={isPending}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                  role === 'member'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                นิติหอพัก
              </button>
              <button
                type="button"
                onClick={() => setRole('service')}
                disabled={isPending}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                  role === 'service'
                    ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                ผู้ให้บริการ
              </button>
            </div>
          </div>

          {/* Name Field (ชื่อนิติ หรือ ชื่อผู้ให้บริการ) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === 'member' ? 'ชื่อนิติหอพัก' : 'ชื่อผู้ให้บริการ'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
              placeholder={role === 'member' ? "ชื่อนิติ" : "ชื่อผู้ให้บริการ"}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
              placeholder="user@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังบันทึก...
              </>
            ) : (
              'สร้างบัญชี'
            )}
          </button>
        </form>

        {/* Feedback Message */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${
            message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
          }`}>
            <div className="flex-1 text-sm font-medium">
              {message.text}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}