import LandingPage from "@/app/components/LandingPage";
import { fetchProjects, fetchServices, fetchTestimonials } from "@/app/lib/cms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, services, testimonials] = await Promise.all([
    fetchProjects(),
    fetchServices(),
    fetchTestimonials(),
  ]);

  return <LandingPage projects={projects} services={services} testimonials={testimonials} />;
}
