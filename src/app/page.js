import React from "react"
import Layout from "./layout"
import BenefitsSection from "../components/BenefitsSection"
import CoreValuesSection from "../components/CoreValuesSection"
import Footer from "../components/Footer"
import HeroSlider from "../components/HeroSlider"
import JoinCommunitySection from "../components/JoinCommunitySection"
import LoadingScreen from "../components/LoadingScreen"
import MainContent from "../components/MainContent"
import MissionVisionSection from "../components/MissionVisionSection"
import Navigation from "../components/Navigation"
import OurStorySection from "../components/OurStorySection"

const Page = () => (
  <Layout>
    <Navigation />
    <LoadingScreen />
    <HeroSlider />
    <MainContent />
    <BenefitsSection />
    <MissionVisionSection />
    <CoreValuesSection />
    <OurStorySection />
    <JoinCommunitySection />
    <Footer />
  </Layout>
)

export default Page

//   "dependencies": {
//     "react": "^19.1.1",
//     "react-dom": "^19.1.1"
//   },
//   "devDependencies": {
//     "@eslint/js": "^9.36.0",
//     "@types/react": "^19.1.13",
//     "@types/react-dom": "^19.1.9",
//     "@vitejs/plugin-react": "^5.0.3",
//     "autoprefixer": "^10.4.21",
//     "eslint": "^9.36.0",
//     "eslint-plugin-react-hooks": "^5.2.0",
//     "eslint-plugin-react-refresh": "^0.4.20",
//     "globals": "^16.4.0",
//     "postcss": "^8.5.6",
//     "tailwindcss": "^3.4.17",
//     "vite": "^7.1.7"
//   }
// }