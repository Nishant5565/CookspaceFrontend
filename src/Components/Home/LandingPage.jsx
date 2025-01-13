import { useGSAP } from "@gsap/react";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import { RECIPE_API } from "@/Constant";
import axios from "axios";
import Recipe from "./Recipe";

function LandingPage() {
  const cursorRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [recipes, setRecipes] = useState([]);

  useGSAP(
    () => {
      const updateCursor = () => {
        gsap.to(cursorRef.current, {
          x: mouseX.current,
          y: mouseY.current,
          ease: "power2.out",
          duration: 0.5,
        });
      };

      const handleMouseMove = (e) => {
        mouseX.current = e.clientX + window.scrollX;
        mouseY.current = e.clientY + window.scrollY;
        updateCursor();
      };

      const handleMouseEnterHome = () => {
        gsap.to(cursorRef.current, {
          scale: 2,
          ease: "elastic.out(2, 0.5)",
          duration: 0.5,
          display: "flex",
        });
      };

      const handleMouseLeaveHome = () => {
        gsap.to(cursorRef.current, {
          scale: 0,
          display: "none",
          ease: "elastic.out(2, 0.5)",
          duration: 0.5,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      const homeSection = document.querySelector(".home");
      homeSection.addEventListener("mouseenter", handleMouseEnterHome);
      homeSection.addEventListener("mouseleave", handleMouseLeaveHome);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        homeSection.removeEventListener("mouseenter", handleMouseEnterHome);
        homeSection.removeEventListener("mouseleave", handleMouseLeaveHome);
      };
    },
    { scope: "home" }
  );

  useEffect(() => {
    axios
      .get(`${RECIPE_API}&includeIngredients	`)
      .then((res) => {
        setRecipes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const lenis = useLenis(({ scroll }) => {});

  return (
    <ReactLenis root>
      <div
        className="min-h-screen bg-gradient-to-r from-gray-100 via-white to-gray-50 text-gray-800 flex flex-col"
        style={{ position: "relative" }}
      >
        <div
          className="w-7 h-7 text-center bg-transparent cursor rounded-full absolute z-50 pointer-events-none text-[8px] flex items-center justify-center"
          ref={cursorRef}
        >
          <p>Cook</p>
        </div>
        <main className="flex-grow">
          <section
            id="home"
            className="bg-cover bg-center relative h-screen bg-fixed cursor-pointer home rounded-[20px] overflow-hidden"
            style={{
              backgroundImage:
                "url('https://images.squarespace-cdn.com/content/651f3a38b2f69811ea35c9f1/1696545478242-294SJ2ZTGE2XQVR8J4EQ/Cover.jpg?format=1500w&content-type=image%2Fjpeg')",
            }}
          >
            <div className="relative z-10 bg-[#00000029] h-screen w-full justify-center items-center flex flex-col text-center">
              <h2 className="text-5xl font-extrabold mb-6 text-white drop-shadow-lg animate-fade-in">
                Discover the Art of Cooking with Cookscape
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200 opacity-90 animate-fade-in delay-200">
                Unleash your culinary creativity. Explore new recipes and master
                the art of cooking.
              </p>
              <Link
                to="/recipes"
                className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-green-500 hover:text-white transition duration-300 animate-fade-in delay-400"
              >
                Start Cooking
              </Link>
            </div>
          </section>

          <section
            id="about"
            className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-[20px] overflow-hidden text-gray-800"
          >
            <div className=" rounded-[10px]  mx-auto bg-gradient-to-b from-gray-50 to-white overflow-hidden shadow-xl">
              <h2 className="text-5xl font-extrabold text-gray-800 mb-16 text-center pt-10">
                About Us
              </h2>
              <div
                className="bg-cover bg-center items-center justify-center relative h-screen flex bg-fixed rounded-[20px] overflow-hidden"
                style={{
                  backgroundImage:
                    "url('https://images.squarespace-cdn.com/content/651f3a38b2f69811ea35c9f1/1696545478242-294SJ2ZTGE2XQVR8J4EQ/Cover.jpg?format=1500w&content-type=image%2Fjpeg')",
                }}
              >
                <div className="bg-[black] bg-opacity-40 h-screen flex items-center justify-center p-10 rounded-lg">
                  <div className="lg:w-1/2 text- leading-relaxed text-white space-y-6">
                    <p>
                      Welcome to <span className=" playwrite">Cookscape</span>,
                      where culinary dreams come true. We specialize in creating
                      unforgettable cooking experiences tailored to your unique
                      tastes.
                    </p>
                    <p>
                      Our passion for cooking drives us to craft seamless
                      culinary journeys that combine flavor, technique, and
                      cultural exploration. From simple home-cooked meals to
                      gourmet dishes, we bring your culinary aspirations to
                      life.
                    </p>
                    <p>
                      With a commitment to excellence and years of expertise,
                      Cookscape is your trusted partner in discovering the world
                      of cooking. Start your next culinary adventure with us and
                      create delicious memories that will last a lifetime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="py-20 text-center bg-white">
            <h2 className="text-4xl font-bold mb-6 text-black">Our Recipes</h2>
            <div className="flex flex-wrap justify-center gap-20">
              {recipes?.results?.map((recipe) => (
                <>
                  <Recipe recipe={recipe} />
                </>
              ))}
            </div>
          </section>
        </main>
      </div>
    </ReactLenis>
  );
}

export default LandingPage;
