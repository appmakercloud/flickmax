import DomainSearch from '@/components/home/DomainSearch'
import ModernServicesWithPricing from '@/components/home/ModernServicesWithPricing'
import FeaturedDeals from '@/components/home/FeaturedDeals'
import TrustSection from '@/components/home/TrustSection'
import Testimonials from '@/components/home/Testimonials'
import FAQ from '@/components/home/FAQ'

export default function Home() {
  return (
    <>
      <DomainSearch />
      <ModernServicesWithPricing />
      <FeaturedDeals />
      <TrustSection />
      <Testimonials />
      <FAQ />
    </>
  )
}