"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/templatesPreview/basicPreviewStore"
import { resetTemplate } from "../../../redux/templatesPreview/basicPreviewSlice"
import StepForm from "./StepForm"
import { toast } from "sonner"

const BasicTemplate: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [showPreview, setShowPreview] = useState<boolean>(false)

  const handleClearAll = () => {
    dispatch(resetTemplate())
    localStorage.removeItem("basicPreview")
    toast.success("All data has been cleared")
  }

  const handleComplete = () => {
    setShowPreview(true)
    router.push("/basic-template-preview")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Basic Template Creator</h1>
            <div className="flex gap-4">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8">
        <StepForm onComplete={handleComplete} />
      </main>
    </div>
  )
}

export default BasicTemplate