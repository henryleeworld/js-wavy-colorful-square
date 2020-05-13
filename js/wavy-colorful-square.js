const BOX_SIZE = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--dot-width").slice(0, -2));
const BOX_SELECTOR = ".box";
const BOX_CONTAINER = document.getElementById("boxes");

const randomRotation = () => gsap.utils.random(0, 360, 1);

const animate = (grid, rotation) => {
  const distributor = createDistributor(grid);

  const rot = rotation || getAppliedRotation() || randomRotation();
  const fromColor = `hsl(${rot}, 54%, 60%)`;

  const toOpts = r => {
    return {
      background: `hsl(${r}, 54%, 60%)`,
      rotate: `${r}deg`,
      ease: "elastic.inOut(1.75, 0.5)",
      onComplete: () => animate(grid, r),
      duration: 2,
      stagger: (i, target, list) => distributor(i, list[i], list) * 0.001 };

  };

  gsap.fromTo(
  BOX_CONTAINER.children,
  {
    background: fromColor,
    rotate: rot },

  toOpts(randomRotation()));

};

createBoxes();
animate(elemsByRow(BOX_SELECTOR));



// HELPERS
// ******************************************************************

// get a function that, when fed an index value, will return a value according to the configuration options
function createDistributor(boxGrid) {
  return gsap.utils.distribute({
    amount: 1000,
    from: [gsap.utils.random(0, 1, 0.01), gsap.utils.random(0, 1, 0.01)],
    grid: [boxGrid.length, boxGrid[0].length] });

}

function getAppliedRotation() {
  // perhaps more performant than getting computed style all the time?
  const indexEl = BOX_CONTAINER.lastElementChild;
  const inlineStyle = indexEl.getAttribute("style");
  if (inlineStyle) {
    const result = /rotate\((\d+)/.exec(inlineStyle);
    if (result) {
      return parseInt(result[1]);
    }
  }
}

function elemsByRow(selector) {
  return gsap.utils.toArray(selector).reduce(
  (r, el) => {
    const lastRow = _.last(r);
    const match = lastRow[0];

    if (
    !match ||
    match.getBoundingClientRect().y === el.getBoundingClientRect().y)
    {
      lastRow.push(el);
    } else {
      r.push([el]);
    }

    return r;
  },
  [[]]);

}

function createBox(baseNode) {
  if (baseNode) {
    return baseNode.cloneNode(true);
  } else {
    const box = document.createElement("div");
    box.classList.add("box");
    return box;
  }
}

function createBoxes() {
  const availWidth = window.innerWidth + BOX_SIZE;
  const availHeight = window.innerHeight + BOX_SIZE;

  const firstBox = createBox();
  BOX_CONTAINER.appendChild(firstBox);

  let lastBox = BOX_CONTAINER.lastElementChild;

  while (
  lastBox.getBoundingClientRect().x <= availWidth &&
  lastBox.getBoundingClientRect().y <= availHeight)
  {
    BOX_CONTAINER.appendChild(createBox(lastBox));
    lastBox = BOX_CONTAINER.lastElementChild;
  }
}