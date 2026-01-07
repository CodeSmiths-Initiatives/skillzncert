import CompleteStudent from "@/features/home/CompleteStudent";
import EverythingYouNeed from "@/features/home/EverythingYouNeed";
import Hero from "@/features/home/Hero";
import ReadyToTransform from "@/features/home/ReadyToTransform";
import WhyChooseCe from "@/features/home/WhyChooseCe";

export default function Home() {
	return (
		<>
			<main>
				<Hero />
				<EverythingYouNeed />
				<CompleteStudent />
				<WhyChooseCe />
				<ReadyToTransform />
			</main>
		</>
	);
}
