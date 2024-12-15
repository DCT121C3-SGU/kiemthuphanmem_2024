import React, { useState, useRef, useEffect } from 'react';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [circleSize, setCircleSize] = useState(128); // Kích thước ban đầu của vòng tròn
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setMousePosition({ x: mouseX, y: mouseY });

        // Tính kích thước vòng tròn dựa trên khoảng cách giữa chuột và tâm
        const distance = Math.sqrt(Math.pow(mouseX - rect.width / 2, 2) + Math.pow(mouseY - rect.height / 2, 2));
        const newCircleSize = Math.min(256, 128 + distance / 2); // Đảm bảo không vượt quá kích thước tối đa
        setCircleSize(newCircleSize);
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div 
      ref={heroRef}
      className='relative w-full h-[500px] overflow-hidden'
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), rgba(255,182,193,0.7))`, // Light pink with mouse effect
        backgroundColor: '#FFB6C1' // Light pink base color
      }}
    >
      <div className='absolute inset-0 flex flex-col justify-center items-center'>
        <div 
          className='bg-white mb-4 rounded-full flex items-center justify-center shadow-lg'
          style={{
            width: `${circleSize}px`, 
            height: `${circleSize}px`
          }}
          aria-label="Logo Placeholder"
        >
          <span className='text-pink-500 font-bold text-2xl'>FOREVER</span>
        </div>
        <div 
          className='text-gray-800 text-center px-4 z-10 relative'
          style={{
            textShadow: '0 0 5px rgba(255,255,255,0.5)'
          }}
        >
          <h1 className='text-2xl font-bold'>
            Bạn đang tìm kiếm đồ uống yêu thích?
          </h1>
          <p className='text-gray-700'>
            Hãy đến với chúng tôi để trải nghiệm những sản phẩm tốt nhất!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
