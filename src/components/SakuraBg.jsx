import React, { useEffect } from 'react';
import './SakuraBg.css';

const NUM_PETALS = 15;

export default function SakuraBg() {
  useEffect(() => {
    const container = document.querySelector('.sakura-container');
    if (!container) return;

    container.innerHTML = ''; // Clear previous petals

    for (let i = 0; i < NUM_PETALS; i++) {
      const petal = document.createElement('img');
      petal.src = `/petals/petal${(i % 10) + 1}.png`; // assuming 10 petal images
      petal.className = 'sakura-petal';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${5 + Math.random() * 10}s`;
      petal.style.width = `${20 + Math.random() * 20}px`;
      container.appendChild(petal);
    }
  }, []);
  

  return <div className="sakura-container pointer-events-none"></div>;
}
