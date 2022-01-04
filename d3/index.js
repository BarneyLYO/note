import { CLASSFICATIONS } from './singletons/classifications.js';
import { COLORS } from './singletons/color.js';
import { MOVIES } from './singletons/movies.js';
import { PETAL_PATH } from './singletons/petal-path.js';
import { FLOWERS } from './singletons/flowers.js';

const d3 = window.d3;
const rectWidth = 50;

const SELECTED_BODY = d3.select('body');
const BUTTON = document.querySelector('#button');
const SPEC_DEF = 'http://www.w3.org/2000/svg';

const times = (count, func) => {
  var i = 0,
    results = [];
  while (i < count) {
    results.push(func(i));
    i += 1;
  }
  return results;
};

const getBodyWidth = () => {
  return document.body.getClientRects()[0].width;
};

const createSvg = (w, h) => {
  const body = document.body;
  const svg = document.createElementNS(SPEC_DEF, 'svg');
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  return svg;
};

{
  const container = d3.select('#container');
  const rects = container.selectAll('rect');

  rects
    .data([1, 2, 3, 4])
    .attr('x', (data, idx) => idx * 20 + idx * 5)
    .attr('y', (d) => 100 - d * 20)
    .attr('height', (d) => d * 20)
    .attr('width', 20)
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '5 5')
    .attr('stroke', 'plum')
    .attr('fill', 'pink');
}

{
  const container = d3.select('#ex2-movies');
  const paths = container.selectAll('path');
  paths
    .data(MOVIES)
    .attr('d', PETAL_PATH)
    .attr('transform', (d, i) => `translate(${50 * i + 50 + 50 * i}, 0)`)
    .attr('fill', (d) => COLORS[d.genres[0]] || COLORS.Other)
    .attr('stroke', (d) => COLORS[d.genres[0]] || COLORS.Other)
    .attr('stroke-width', 2);
}

{
  const svg = createSvg(getBodyWidth(), 200);
  document.body.appendChild(svg);
  const data = [90, 30, 58, 29, 60, 1, 14, 47];
  const xScale = d3
    .scaleBand()
    .domain(Object.keys(data))
    .range([0, getBodyWidth()])
    .padding(0.34);
  const max = d3.max(data, (d) => d);
  const yScale = d3.scaleLinear().domain([0, max]).range([200, 0]);

  d3.select(svg)
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width', 50)
    .attr('height', (d) => 200 - yScale(d))
    .attr('fill', 'yellow')
    .attr('x', (d, i) => {
      return xScale(i + '');
    })
    .attr('y', (d) => yScale(d));
}

{
  const svg = SELECTED_BODY.append('svg')
    .attr('width', getBodyWidth())
    .attr('height', (FLOWERS.length / 4) * 50);

  const g = svg
    .selectAll('g')
    .data(FLOWERS)
    .enter()
    .append('g')
    .attr(
      'transform',
      (d) => `translate(${d.translate[0]}, ${d.translate[1]})`
    );

  g.selectAll('path')
    .data((d) => {
      return times(d.numPetals, (i) => ({
        ...d,
        rotate: i * (360 / d.numPetals),
      }));
    })
    .enter()
    .append('path')
    .attr('transform', (d) => `rotate(${d.rotate})scale(${d.scale})`)
    .attr('d', (d) => d.path)
    .attr('fill', (d) => d.color)
    .attr('stroke', (d) => d.color)
    .attr('fill-opacity', 0.5)
    .attr('stroke-width', 2);

  g.append('text')
    .text((d) => d.title)
    .attr('font-size', '.7em')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em');
}

{
  let list = [1, 2, 3, 4, 5, 6, 7, 8];
  const svg = SELECTED_BODY.append('svg')
    .attr('width', getBodyWidth())
    .attr('height', 100);
  const updateBarsOld = (svg, data) => {
    const rects = svg.selectAll('rect');
    const bounded = rects.data(data, (d) => d);
    console.log(bounded.exit());
    // exit
    bounded.exit().remove();

    // create
    const enter = bounded
      .enter()
      .append('rect')
      .attr('width', rectWidth)
      .attr('fill', 'pink')
      .attr('stroke', 'plum')
      .attr('stroke-width', 2);

    // merge
    enter
      .merge(bounded)
      .attr('x', (d, i) => i * rectWidth)
      .attr('y', (d) => 100 - d || 0)
      .attr('height', (d) => d || 0);
  };

  const updateBarsNew = (svg, data) => {
    svg
      .selectAll('rect')
      .data(data, (d) => d)
      .join('rect')
      .attr('x', (d, i) => i * rectWidth)
      .attr('y', (d) => 100 - d || 0)
      .attr('height', (d) => d || 0)
      .attr('width', rectWidth)
      .attr('fill', 'pink')
      .attr('stroke', 'plum')
      .attr('stroke-width', 2);
  };

  const ref = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const updated = [90, 80, 70, 60, 50, 40, 30, 20, 10];
  let current = ref;
  BUTTON.addEventListener('click', (e) => {
    if (current === ref) {
      current = updated;
    } else {
      current = ref;
    }
    updateBarsNew(svg, current);
  });
}
// {
//   const body = document.body;
//   const w = 80;
//   const h = MOVIES.length * 50;
//   const svg = document.createElementNS(SPEC_DEF, 'svg');
//   svg.setAttribute('width', w);
//   svg.setAttribute('height', h * 2);
//   const container = d3.select(svg);
//   const paths = container.selectAll('path');
//   paths
//     .data(MOVIES)
//     .enter()
//     .append('path')
//     .attr('transform', (d, i) => `translate(40, ${50 * i + i * 50})`)
//     .attr('fill', (d) => COLORS[d.genres[0]])
//     .attr('d', (d) => {
//       const rated = CLASSFICATIONS[d.rated];
//       return rated;
//     });

//   body.appendChild(svg);
// }
