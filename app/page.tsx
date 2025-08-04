import DomainSearch from '@/components/home/DomainSearch'
import ModernServices from '@/components/home/ModernServices'
import FeaturedDeals from '@/components/home/FeaturedDeals'
import TrustSection from '@/components/home/TrustSection'
import Testimonials from '@/components/home/Testimonials'
import FAQ from '@/components/home/FAQ'

export default function Home() {
  return (
    <>
      <DomainSearch />
      <ModernServices />
      <FeaturedDeals />
      <TrustSection />
      <Testimonials />
      <FAQ />
    </>
  )
}