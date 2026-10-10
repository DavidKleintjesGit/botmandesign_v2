import LandingPage from "@/app/components/LandingPage";
import { fetchProjects, fetchServices } from "@/app/lib/cms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, services] = await Promise.all([fetchProjects(), fetchServices()]);

  return <LandingPage projects={projects} services={services} />;
}
