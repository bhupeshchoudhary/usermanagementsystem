"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireApproval?: boolean
}

export function ProtectedRoute({ children, allowedRoles, requireApproval = true }: ProtectedRouteProps) {
  const { user, loading, authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !authLoading) {
      // Check if user is authenticated
      if (!user) {
        router.push("/auth/signin")
        return
      }

      // Check if user needs approval
      if (requireApproval && !user.isApproved) {
        router.push("/pending-approval")
        return
      }

      // Check role-based access
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, loading, authLoading, router, allowedRoles, requireApproval])

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading LinuxWorld...</p>
        </div>
      </div>
    )
  }

  // Check authentication and authorization
  if (!user || (requireApproval && !user.isApproved) || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}
