const DEFAULT = 'rgba(200,0,0,0.5)';
const CHANGE = 'rgba(0,0,200,0.5)';

const cvs1 = document.querySelector('#id1');
const cvs2 = document.querySelector('#id2');
const cvs3 = document.querySelector('#id3');
const cvs4 = document.querySelector('#id4');
const cvs5 = document.querySelector('#id5');

function drawListRect(cvs, x, y, style) {
  if (!cvs.getContext) {
    return;
  }
  const ctx = cvs.getContext('2d');
  if (x > 150 || y > 150) {
    return;
  }
  ctx.fillStyle = style;
  ctx.fillRect(x, y, 50, 50);
  drawListRect(cvs, x + 10, y + 10, style === CHANGE ? DEFAULT : CHANGE);
}

function drawNestingRect(cvs, x, y, w, h, style) {
  if (!cvs.getContext) {
    return;
  }
  const ctx = cvs.getContext('2d');
  if (w < 10 || h < 10) {
    return;
  }
  ctx.strokeStyle = style;
  ctx.strokeRect(x, y, w, h);
  drawNestingRect(
    cvs,
    x + 10,
    y + 10,
    w - 20,
    h - 20,
    style === CHANGE ? DEFAULT : CHANGE
  );
}

function drawTriangle(cvs) {
  if (!cvs.getContext) {
    return;
  }
  const ctx = cvs.getContext('2d');
  ctx.strokeStyle = DEFAULT;
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(75, 10);
  ctx.lineTo(10, 75);
  ctx.closePath();
  ctx.stroke();
}

function drawSmailFace(cvs) {
  if (!cvs.getContext) {
    return;
  }
  const ctx = cvs.getContext('2d');
  ctx.strokeStyle = DEFAULT;
  ctx.beginPath();
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
  ctx.moveTo(110, 75);
  ctx.arc(75, 75, 35, 0, Math.PI, false);
  ctx.moveTo(65, 65);
  ctx.arc(60, 65, 5, 0, Math.PI * 2, true);
  ctx.moveTo(95, 65);
  ctx.arc(90, 65, 5, 0, Math.PI * 2, true);
  //ctx.closePath();
  ctx.stroke();
}

function drawSadFace(cvs) {
  if (!cvs.getContext) {
    return;
  }
  const ctx = cvs.getContext('2d');
  ctx.strokeStyle = DEFAULT;
  ctx.beginPath();
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true);

  ctx.moveTo(55, 105);
  ctx.arc(75, 105, 20, Math.PI, 0, false);

  ctx.moveTo(65, 65);
  ctx.arc(60, 65, 5, 0, Math.PI * 2, true);
  ctx.moveTo(95, 65);
  ctx.arc(90, 65, 5, 0, Math.PI * 2, true);
  //ctx.closePath();
  ctx.stroke();
}

const drawConnectLine = (ctx, decider, ...points) => {
  ctx.beginPath();
  const [start, ...rest] = points;
  ctx.moveTo(start[0], start[0]);

  for (let p of rest) {
    ctx.lineTo(p[0], p[1]);
  }
  decider(ctx);
};

drawListRect(cvs1, 0, 0, DEFAULT);
drawNestingRect(cvs2, 0, 0, 150, 150, DEFAULT);

drawTriangle(cvs3);
drawSmailFace(cvs4);
const ctx = cvs5.getContext('2d');
drawConnectLine(
  ctx,
  (ctx) => {
    ctx.strokeStyle = DEFAULT;
    ctx.closePath();
    ctx.stroke();
  },
  [25, 25],
  [105, 25],
  [25, 105]
);
drawConnectLine(
  ctx,
  (ctx) => {
    ctx.fillStyle = CHANGE;
    //ctx.closePath();
    ctx.fill();
  },
  [125, 125],
  [125, 45],
  [45, 125]
);

{
  let csvState = 'smail';
  cvs4.addEventListener('click', (e) => {
    const ctx = cvs4.getContext('2d');
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (csvState === 'smail') {
        drawSadFace(cvs4);
        csvState = 'sad';
        return;
      }

      drawSmailFace(cvs4);
      csvState = 'smail';
    }
    // ctx.cleanRect(0, 0, cvs4.attributes.width, cvs4.attributes.height);
  });
}

const drawPath2D = () => {
  const canvas = document.querySelector('#id6');
  if (!canvas.getContext) {
    return;
  }
  const ctx = canvas.getContext('2d');
  const rectangle = new Path2D();
  rectangle.rect(10, 10, 50, 50);

  const circle = new Path2D();
  circle.moveTo(125, 35);
  circle.arc(100, 35, 25, 0, 2 * Math.PI);

  ctx.stroke(rectangle);
  ctx.fill(circle);
};
drawPath2D();

const drawColorBoard = () => {
  const canvas = document.querySelector('#id7');
  if (!canvas.getContext) {
    return;
  }
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.fillStyle = `rgb(${Math.floor(255 - 42.5 * i)},${Math.floor(
        255 - 42.5 * j
      )}, 0)`;

      ctx.fillRect(j * 25, i * 25, 25, 25);
    }
  }
};

drawColorBoard();

const clipExample = () => {
  const cvs = document.querySelector('#id8');
  const ctx = cvs.getContext('2d');

  cvs.addEventListener('click', (e) => {
    console.log('clip');
    const data = cvs.toDataURL();
    const img = document.createElement('img');
    img.src = data;
    document.body.appendChild(img);
  });
  const defaultStyle = ctx.fillStyle;
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 150, 150);
  ctx.translate(75, 75);
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2, true);
  ctx.clip();

  const drawStart = (r) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r, 0);
    for (let i = 0; i < 9; i++) {
      ctx.rotate(Math.PI / 5);
      if (i % 2 === 0) {
        ctx.lineTo(
          (r / 0.525731) * 0.200811,
          //
          0
        );
      } else {
        ctx.lineTo(r, 0);
      }
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const lingrad = ctx.createLinearGradient(0, -75, 0, 75);
  lingrad.addColorStop(0, '#232256');
  lingrad.addColorStop(1, '#143778');
  ctx.fillStyle = lingrad;
  ctx.fillRect(-75, -75, 150, 150);

  for (let j = 1; j < 50; j++) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.translate(
      75 - Math.floor(Math.random() * 150),
      75 - Math.floor(Math.random() * 150)
    );
    const r = ((Math.random() * 4) | 0) + 2;
    drawStart(r);
    ctx.restore();
  }
};

clipExample();
