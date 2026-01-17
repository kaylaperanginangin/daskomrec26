import React, { useRef } from 'react';
import { Head } from '@inertiajs/react'; 
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

import ocean from '../assets/ocean.jpeg';
import cave from '../assets/cave.png';
import DaskomBnW01 from '../assets/DaskomBnW01.png';
import DLOR_Plain2 from '../assets/DLOR_Plain2.png';
import utama from '../assets/utama.png';
import Button09 from '../assets/09-Button.png';
import door2 from '../assets/door2.png';
import trial from '../assets/trial.png';
import road from '../assets/road.png';
import Fish01L from '../assets/01-FishL.png';
import Fish01R from '../assets/01-FishR.png';
import Fish02 from '../assets/02-Fish.png';
import Sign04 from '../assets/04-Sign.png';





export default function Welcome() {
  const parallax = useRef(null);

  const styles = `
    @keyframes swimRight {
      from { transform: translateX(-50vw); }
      to { transform: translateX(120vw); }
    }
    @keyframes swimLeft {
      from { transform: translateX(120vw) scaleX(-1); }
      to { transform: translateX(-50vw) scaleX(-1); }
    }
    .fish-swim-right { animation: swimRight 35s linear infinite; }
    .fish-swim-left { animation: swimLeft 40s linear infinite; }
  `;

  return (
    <>
      <Head title="DLOR 2026 (Atlantis)" />
      <style>{styles}</style>

      <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
        
        <Parallax ref={parallax} pages={3} style={{ top: '0', left: '0', backgroundColor: '#00022c' }}>
          {/* SECTION 1 */}
          <ParallaxLayer 
            offset={0}
            speed={0.2} 
            factor={1}
            style={{
              backgroundImage: `url(${ocean})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(2px)',
              transform: 'scale(1.1)',
            }}
          />

          <ParallaxLayer
            offset={0}
            speed={0.2} 
            factor={2} 
            style={{
              pointerEvents: 'none', 
              zIndex: 50, 
            }}
          >
            <div style={{
                width: '100%', 
                height: '100%',
                backgroundImage: `url(${cave})`,
                backgroundSize: '100% 100%', 
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center top',
              }}
            />
          </ParallaxLayer>

          <ParallaxLayer
            offset={0}
            speed={0.5}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100, 
            }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',

                textAlign: 'center',
                color: 'white',
                maxWidth: '650px',
                padding: '0 20px',
                fontFamily: 'Caudex, serif',
                marginTop: '300px',
              }}
             >
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' , alignItems: 'center', gap: '5px' }}>
                <img src={DaskomBnW01} alt="Logo Daskom" style={{ width: '150px', height: 'auto' }} />
                <img src={DLOR_Plain2} alt="Logo DLOR" style={{ width: '150px', height: 'auto' }} />
              </div>

              <div style={{ fontSize: '30px', lineHeight: '1.8', textShadow: '0 2px 10px rgba(0,0,0,0.5)', textAlign: 'left',}}>
                <p style={{ marginBottom: '25px' }}>
                  True knowledge, like the lost kingdom,<br/>
                  awaits only in the crushing deep.
                </p>
                <p style={{ marginBottom: '25px' }}>
                  The gates of this Atlantis have opened for<br/>
                  those brave enough to endure the pressure.
                </p>
                <p style={{ marginBottom: '25px' }}>
                  We seek resilient guardians to uphold a<br/>
                  legacy time could not erode.
                </p>
                <p style={{ marginBottom: '25px' }}>
                  Descend into the unknown and forge the<br/>
                  future.
                </p>
                <p style={{ fontSize: '30px'}}>
                  Are you ready for the adventure?
                </p>
              </div>

              <div 
                onClick={() => parallax.current.scrollTo(2)}
                style={{ 
                  marginTop: '30px', 
                  animation: 'bounce 2s infinite',
                  display: 'flex',
                  cursor: 'pointer'
                }}
              >
                <img 
                    src= {Button09} 
                    alt="Scroll Down Button" 
                    style={{ width: '50px', height: 'auto'}} 
                />
              </div>

             </div>
          </ParallaxLayer>

            {/* SECTION 2 */}
          <ParallaxLayer 
            offset={1} 
            speed={0} 
            factor={2}
            style={{
              backgroundImage: `url(${utama})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1,
            }}
          />
          <ParallaxLayer
            offset={1.15}
            speed={0.05}
            style={{ 
                zIndex: 2,       
                pointerEvents: 'none' 
            }}
          >

             <img src={Fish01R} className="fish-swim-right" style={{ position: 'absolute', top: '40%', left: '-10%', width: '110px', opacity: 0.7 }} />
             <img src={Fish02} className="fish-swim-left" style={{ position: 'absolute', top: '60%', right: '-10%', width: '90px', opacity: 0.5, animationDelay: '2s' }} />
             <img src={Fish01R} className="fish-swim-right" style={{ position: 'absolute', top: '80%', left: '-20%', width: '60px', opacity: 0.3, filter: 'blur(1px)', animationDelay: '10s' }} />
          </ParallaxLayer>

            <ParallaxLayer
                offset={1.15}
                speed={0.1}
                style={{
                    display:'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingTop: '45vh',
                    zIndex: 3
                }}
                >
                    <img
                        src={trial}
                        alt="trial"
                       style={{
                            width: '100%',
                            height: 'auto', 
                           
                        }}
                        />
                </ParallaxLayer>

            <ParallaxLayer
              offset={1.15}      
              speed={0.1}       
              style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start', 
                  paddingTop: '40vh',      
                  zIndex: 3               
              }}
          >
              <img
                  src={door2}
                  alt="door"
                  style={{
                      width: '100%',      
                      height: 'auto',
                      marginTop: '15vh', 
                  }}
              />
          </ParallaxLayer>

          <ParallaxLayer
              offset={1.15}     
              speed={0.1}   
              style={{
                  display: 'flex',
                  flexDirection: 'column', 
                  alignItems: 'center',  
                  zIndex: 3              
              }}
          >

              <div 
                  onClick={() => alert("Menuju Login Page...")} 
                  style={{
                      marginTop: '110vh', 
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      position: 'relative',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                  <img
                      src={Sign04} 
                      alt="Start"
                      style={{
                          width: '450px',
                          height: 'auto',
                          filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))',
                          display: 'block',
                      }}
                  />
                  <span style={{
                      position: 'absolute',   
                      top: '50%',           
                      left: '50%',           
                      transform: 'translate(-50%, -60%)',
                  
                      fontFamily: 'Caudex',
                      fontSize: '45px',      
                      fontWeight: 'semibold',
                      color: '#ffffff',        
                      letterSpacing: '2px',   
                      pointerEvents: 'none'   
                  }}>
                      START
                  </span>
              </div>

              
              <div style={{
                 position: 'absolute', 
                  marginTop: '190vh',      
                  left: 0,
                  right: 0,          
                  textAlign: 'center',
                  
                  fontFamily: 'Caudex',
                  color: 'rgba(255,255,255, 0.6)',
                  fontSize: '20px',
                  letterSpacing: '1px'
              }}>
                  @Atlantis.DLOR2026. All Right Served
              </div>

          </ParallaxLayer>

            <ParallaxLayer
                offset={1.15}
                speed={0.1}
                factor={2}
                style={{
                  zIndex: 3
                }}
                >
                  <img
                      src={road}
                      alt="rocks"
                      style={{
                          width: '100%',
                          height: 'auto',
                          position: 'absolute',
                          bottom: '40px',
                          left: '0',
                      }}
                      />
                </ParallaxLayer>

        </Parallax>
      </div>
    </>
  )
}