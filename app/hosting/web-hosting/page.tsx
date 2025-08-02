import HostingHero from '@/components/hosting/HostingHero'
import TabbedHostingPlans from '@/components/hosting/TabbedHostingPlans'
import WhyChooseFlickmax from '@/components/hosting/WhyChooseFlickmax'
import SocialProof from '@/components/hosting/SocialProof'
import HostingComparison from '@/components/hosting/HostingComparison'
import HostingFAQ from '@/components/hosting/HostingFAQ'
import HostingCTA from '@/components/hosting/HostingCTA'

export default function WebHostingPage() {
  return (
    <>
      <HostingHero />
      <TabbedHostingPlans />
      <WhyChooseFlickmax />
      <SocialProof />
      <HostingComparison />
      <HostingFAQ />
      <HostingCTA />
    </>
  )
}