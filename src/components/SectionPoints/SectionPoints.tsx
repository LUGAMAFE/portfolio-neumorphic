import { SectionPoint } from './SectionPoint/SectionPoint';
import { SectionPointProjects } from './SectionPointProjects/SectionPointProjects';

import useIsMobile from '@/hooks/useIsMobile';
import style from './sectionPoints.module.scss';
export const SectionPoints = ({}) => {
  const isMobile = useIsMobile();

  return (
    <div>
      {!isMobile && (
        <div className={style.SectionPoints}>
          <SectionPoint classPointer={'#seccion0'} index={0} />
          <SectionPoint classPointer={'#seccion1'} index={1} />
          <SectionPoint classPointer={'#seccion2'} index={2} />
          <div
            className="si"
            style={{
              width: '30px',
              height: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
              willChange: 'transform',
            }}
          >
            <SectionPointProjects classname="anchor" classPointer={'#project0'} index={0} />
            <SectionPointProjects classname="anchor" classPointer={'#project1'} index={1} />
            <SectionPointProjects classname="anchor" classPointer={'#project2'} index={2} />
            <SectionPointProjects classname="anchor" classPointer={'#project3'} index={3} />
            <SectionPointProjects classname="anchor" classPointer={'#project4'} index={4} />
            <SectionPointProjects classname="anchor" classPointer={'#project5'} index={5} />
          </div>
          <SectionPoint classPointer={'#seccion3'} index={3} />
          <SectionPoint classPointer={'#seccion4'} index={4} />
          <SectionPoint classPointer={'#seccion5'} index={5} />
          <SectionPoint classPointer={'#seccion6'} index={6} />
        </div>
      )}
      {/* <div className={style.SectionPoints___projects} >
                {array.array2.map((classPointer, index) => (
                    <SectionPointProjects onClick={() => onClick(`project${index}`, `svgWhiteClickProjects${index}`, `svgPinkProjects${index}`)} onMouseOver={() => onMouseOver(`svgWhiteProjects${index}`)} key={classPointer} classPointer={classPointer} index={index} handleMouseLeave={() => handleMouseLeave(`svgWhiteProjects${index}`)} />
                ))}
            </div>
            <div className={style.SectionPoints_second} >
                {array.array3.map((classPointer, index) => (
                    <SectionPoint onClick={() => onClick(`seccion${index + 3}`, `svgWhiteClick${index + 3}`, `svgPink${index + 3}`)} onMouseOver={() => onMouseOver(`svgWhite${index + 3}`)} key={classPointer} classPointer={classPointer} index={index + 3} handleMouseLeave={() => handleMouseLeave(`svgWhite${index + 3}`)} />
                ))}
            </div> */}
    </div>
  );
};
