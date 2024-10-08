import { useEffect, useState } from "react";
import Page from "../templates/Page";
import { ChoiceUIProps } from "@vuo/types/organismProps";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@vuo/components/atoms/Card";
// import CardActionBtn from "../atoms/CardActionBtn";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";
import module from "@vuo/scss/components/organisms/ChoiceUI.module.scss";
import {
  IsDragOffBoundary,
  CardSwipeDirection,
} from "@vuo/types/moleculeProps";

const ChoiceUI = ({
  meals = [],
  setMeals = () => {},
  isAnimating,
  setIsAnimating,
  handleChoice,
}: ChoiceUIProps) => {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [direction, setDirection] = useState<CardSwipeDirection | "">("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const cardVariants = {
    current: { opacity: 1, scale: 1 },
    exit: (custom: { direction: string }) => ({
      opacity: 0,
      y: custom.direction === "up" ? -300 : 300,
      zIndex: 0,
      transition: {
        duration: 0.2,
        delay: 0.5,
      },
    }),
  };

  const handleCardClick = (meals: FlavourFlowMeal[], meal: FlavourFlowMeal) => {
    setIsAnimating?.(true);
    setSelectedMealId(meal.id);
    const loser = meals.find((m) => m.id !== meal.id) as FlavourFlowMeal;
    handleChoice(meal, loser);

    setTimeout(() => {
      setIsAnimating?.(false);
      setSelectedMealId(null);
    }, 300);
    return meal.id;
  };

  const handleDirectionChange = (newDirection: "up" | "down") => {
    setDirection(newDirection);
    setMeals((prev) => prev.slice(1));

    setTimeout(() => {
      setDirection("");
    }, 300);
  };

  useEffect(() => {
    setIsSelected(selectedMealId !== null);
  }, [selectedMealId]);

  const containerClass =
    meals?.length > 2 ? module.scrollableContainer : module.staticContainer;

  return (
    <Page>
      <div className={containerClass}>
        <div className={module.cardContainer}>
          <AnimatePresence>
            {!isAnimating &&
              meals.map((meal: FlavourFlowMeal, index: number) => {
                // const isSelected = meal.id === selectedMealId;
                return (
                  <motion.div
                    key={meal.id}
                    variants={cardVariants}
                    // initial="current"
                    custom={{ direction }}
                    exit="exit"
                    tabIndex={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  >
                    <Card
                      id={`card-${index}`}
                      meal={meal}
                      onClick={() => {
                        setIsSelected(selectedMealId === meal.id);
                        handleCardClick(meals, meal);
                        handleDirectionChange(isSelected ? "down" : "up");
                      }}
                      index={index}
                      isSelected={isSelected}
                      // drag={"y"}
                      // setDirection={setDirection}
                      // setIsDragging={setIsDragging}
                      // setIsDragOffBoundary={setIsDragOffBoundary}
                      // handleDirectionChange={handleDirectionChange}
                      cardContainerClass={module.cardContainer}
                      cardClass={
                        index === 0
                          ? `${module.card} ${module.firstCard}`
                          : `${module.card} ${module.secondCard}`
                      }
                      titleClass={module.cardTitle}
                      btnActiveClass={module.cardButtonActive}
                      btnIconActiveClass={module.cardButtonIconActive}
                      textActiveClass={module.cardTextActive}
                      overlayActiveClass={module.cardOverlayActive}
                      btnClass={module.cardButton}
                      btnIconClass={module.cardButtonIcon}
                      imageClass={module.cardImage}
                      deckContainerClass={module.cardDeckContainer}
                      deckClass={module.cardDeck}
                      isAnimating={isAnimating}
                    />
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>
    </Page>
  );
};

export default ChoiceUI;

{
  /* <div>
          <CardActionBtn
            direction="up"
            onClick={() => handleDirectionChange("up")}
          />
          <CardActionBtn
            direction="down"
            onClick={() => handleDirectionChange("down")}
          />
        </div> */
}
