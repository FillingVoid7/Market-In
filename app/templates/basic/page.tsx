"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../redux/templatesPreview/basicPreviewStore"
import { resetTemplate } from "../../../redux/templatesPreview/basicPreviewSlice"
import StepForm from "./StepForm"
import { toast } from "sonner"

const SocialMediaTemplatePreview: React.FC = () => {
  const socialMediaTemplates = useSelector((state: RootState) => state.basicPreview.socialMediaTemplates)

  if (!socialMediaTemplates.length) return null

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {socialMediaTemplates.map((template, idx) => (
        <div
          key={idx}
          className="w-full max-w-xl bg-[#181A20] rounded-2xl shadow-lg p-6 mb-6 border border-[#23262F]"
        >
          {template.caption && (
            <p className="text-gray-100 text-lg mb-4">{template.caption}</p>
          )}
          {template.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {template.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs text-blue-200 bg-[#23262F] px-3 py-1 rounded-full tracking-wide"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {template.callToAction && (
            <div className="mt-4">
              <div className="w-full bg-[#23262F] rounded-lg px-4 py-3 flex justify-center">
                <span className="text-blue-400 font-semibold text-base">
                  {template.callToAction}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

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
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Homepage
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm hover:shadow-md"
            >
              Clear All
            </button>
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