'use client'
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { getAllSubscriptionHistoryByUserId, resumeSubscription } from "./action"
import { Loader2, History, CreditCard, CheckCircle2, AlertCircle } from "lucide-react" // แนะนำให้ใช้ Icon เพื่อความสวยงาม

export interface Subscription {
  id: string,
  start_date: string,
  expired_date: string
}

export default function SubscriptionComponent({ id }: { id: string }) {

  const [loading, setLoading] = useState<boolean>(true) // เริ่มต้นควรเป็น true เพื่อกัน UI กระพริบ
  const [resumeLoading, setResumeLoading] = useState<boolean>(false)
  const [subscriptionHistory, setSubscriptionHistory] = useState<Subscription[]>([])

  // ดึงข้อมูลเมื่อ Component โหลด
  useEffect(() => {
    fetchCurrStatus()
  }, [id])

  const fetchCurrStatus = async () => {
    setLoading(true)
    try {
      const result = await getAllSubscriptionHistoryByUserId(id)
      if (result.success) {
        // เรียงข้อมูลจากใหม่ไปเก่าเสมอ เพื่อความชัวร์
        const sortedData = (result.data || []).sort((a: Subscription, b: Subscription) => 
          new Date(b.expired_date).getTime() - new Date(a.expired_date).getTime()
        )
        setSubscriptionHistory(sortedData)
      }
    } catch (err) {
      toast.error('ไม่สามารถดึงข้อมูลสมาชิกได้')
    } finally {
      setLoading(false)
    }
  }

  // คำนวณสถานะปัจจุบัน
  const latestSub = subscriptionHistory.length > 0 ? subscriptionHistory[0] : null
  const isExpired = latestSub 
    ? new Date(latestSub.expired_date) < new Date() 
    : true // ถ้าไม่มีประวัติเลย ถือว่าหมดอายุ/ยังไม่สมัคร

  // ฟังก์ชันแปลงวันที่ให้อ่านง่ายแบบไทย
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleResumeSubscription = async () => {
    setResumeLoading(true)
    try {
      const data = await resumeSubscription(id)

      if (data.success && data.data) {
        toast.success("ส่งคำขอต่ออายุสมาชิกเรียบร้อยแล้ว") // แจ้งเตือนผู้ใช้
        setSubscriptionHistory(prev => ([data.data!, ...prev]))
      } else {
        toast.error("เกิดข้อผิดพลาดในการต่ออายุ")
      }
    } catch (error) {
      toast.error("เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว")
    } finally {
      setResumeLoading(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center py-10 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      กำลังโหลดข้อมูลสมาชิก...
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-4 mb-4">
        <CreditCard className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">จัดการสมาชิก (Subscription)</h2>
      </div>

      {/* 1. ส่วนแสดงสถานะปัจจุบัน (Current Status Card) */}
      <div className={`p-6 rounded-xl border shadow-sm transition-all ${
        !isExpired 
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-200" 
          : "bg-white border-gray-200"
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">สถานะปัจจุบัน</p>
            <div className="flex items-center gap-2">
              {!isExpired ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-lg font-bold text-emerald-700">สมาชิก Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-bold text-gray-600">ไม่ได้เป็นสมาชิก</span>
                </>
              )}
            </div>
            
            {latestSub && !isExpired && (
              <p className="text-sm text-emerald-600 mt-2">
                หมดอายุวันที่: {formatDate(latestSub.expired_date)}
              </p>
            )}
          </div>

          {/* ปุ่ม Resume จะโชว์เมื่อหมดอายุแล้วเท่านั้น */}
          {isExpired && (
            <button
              onClick={handleResumeSubscription}
              disabled={resumeLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resumeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {resumeLoading ? "กำลังส่งคำขอ..." : "ขอต่ออายุสมาชิก"}
            </button>
          )}
        </div>
      </div>

      {/* 2. ส่วนแสดงประวัติ (History List) */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <History className="w-5 h-5" />
          <h3 className="font-medium">ประวัติการสมัครสมาชิก</h3>
        </div>

        <div className="space-y-3">
          {subscriptionHistory.length > 0 ? (
            subscriptionHistory.map((sub, index) => (
              <div 
                key={sub.id || index} 
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-mono">ID: {sub.id.slice(0, 8)}...</span>
                  <span className="text-sm font-medium text-gray-700">
                    รอบบิล: {formatDate(sub.start_date)}
                  </span>
                </div>
                
                <div className="mt-2 sm:mt-0 text-right">
                  <span className="text-xs text-gray-500 mr-2">ถึงวันที่</span>
                  <span className={`text-sm font-medium ${
                    new Date(sub.expired_date) < new Date() ? 'text-gray-500' : 'text-emerald-600'
                  }`}>
                    {formatDate(sub.expired_date)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-400 text-sm">ยังไม่มีประวัติการสมัครสมาชิก</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}