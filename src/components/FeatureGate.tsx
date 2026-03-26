import { Navigate } from 'react-router-dom'
import useMainStore from '@/stores/useMainStore'
import { FeatureId, PLANS } from '@/lib/plans'

export function FeatureGate({
  children,
  feature,
}: {
  children: React.ReactNode
  feature: FeatureId
}) {
  const { currentPlan } = useMainStore()
  const planConfig = PLANS[currentPlan]

  if (!planConfig.features.includes(feature)) {
    return <Navigate to="/billing" replace />
  }

  return <>{children}</>
}
