import { useState, useEffect } from "react";

const ClickEffect = () => {
  const [clicks, setClicks] = useState<{ x: number; y: number; id: number }[]>([]);
  const [clickId, setClickId] = useState(0);

  useEffect(() => {
    const removeClick = (id: number) => {
      setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
    };

    const handleMouseClick = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const id = clickId;
      setClicks((prevClicks) => [...prevClicks, { x, y, id }]);
      setClickId((prevId) => prevId + 1);

      // Remove the effect after 1 second
      setTimeout(() => removeClick(id), 1000);
    };

    window.addEventListener("click", handleMouseClick);
    return () => {
      window.removeEventListener("click", handleMouseClick);
    };
  }, [clickId]);

  return (
    <>
      {clicks.map(({ x, y, id }) => (
        <span
          key={id}
          className="click-effect"
          style={{
            position: "absolute",
            top: y,
            left: x,
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            animation: "float 1s ease-out forwards",
            zIndex: 9999,
          }}
        >
          ❤️
        </span>
      ))}
      <style jsx>{`
      @keyframes float {
        from {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        to {
          opacity: 0;
          transform: translate(-50%, -150%) scale(2);
        }
      }
      
      `}</style>
    </>
  );
};

export default ClickEffect;
