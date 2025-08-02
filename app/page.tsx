import DomainSearch from '@/components/home/DomainSearch'
import ModernServices from '@/components/home/ModernServices'
import DomainShowcase from '@/components/home/DomainShowcase'
import TrustSection from '@/components/home/TrustSection'
import PricingTable from '@/components/pricing/PricingTable'
import Testimonials from '@/components/home/Testimonials'
import FAQ from '@/components/home/FAQ'

export default function Home() {
  return (
    <>
      <DomainSearch />
      <ModernServices />
      <TrustSection />
      <PricingTable category="hosting" />
      <DomainShowcase />
      <Testimonials />
      <FAQ />
    </>
  )
}