import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Reseller } from '@/types'
import { ResellerFormModal } from './ResellerFormModal'
import { ResellerSellModal } from './ResellerSellModal'
import { Network } from 'lucide-react'

export function ResellerCard({ reseller }: { reseller: Reseller }) {
  return (
    <Card className="flex flex-col border-none shadow-sm hover:shadow-md transition-shadow h-full bg-card group">
      <CardContent className="p-6 flex flex-col items-center justify-center flex-1 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-105 transition-transform duration-300">
          <Network className="h-8 w-8" />
        </div>
        <CardTitle className="text-xl font-bold truncate w-full" title={reseller.name}>
          {reseller.name}
        </CardTitle>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0 justify-center w-full">
        <ResellerSellModal reseller={reseller} />
        <ResellerFormModal reseller={reseller} />
      </CardFooter>
    </Card>
  )
}
