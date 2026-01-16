import AboutUs from "@/features/home/AboutUs";
import HeroSlider from "@/features/home/HeroSlider";
import PaymentPlan from "@/features/home/PaymentPlan";
import ProblemStatement from "@/features/home/ProblemStatement";
import Solution from "@/features/home/Solution";

export default function Home() {
	return (
		<>
			<main className="pt-16">
				<HeroSlider />
				<AboutUs />
				<ProblemStatement />
				<Solution />
				<PaymentPlan />
			</main>
		</>
	);
}
