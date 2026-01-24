import AboutUs from "@/features/home/AboutUs";
import Faq from "@/features/home/Faq";
import HeroSlider from "@/features/home/HeroSlider";
import PaymentPlan from "@/features/home/PaymentPlan";
import ProblemStatement from "@/features/home/ProblemStatement";
import Solution from "@/features/home/Solution";

export default function Home() {
	return (
		<>
			<main className="pt-16">
				<section id="HeroSlider">
					<HeroSlider />
				</section>
				<section id="About">
					<AboutUs />
				</section>
				<section>
					<ProblemStatement />
				</section>
				<section id="Courses">
					<Solution />
				</section>
				<section>
					<PaymentPlan />
				</section>
				<section>
					<Faq />
				</section>
			</main>
		</>
	);
}
