const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");
const stoneStateList = [];
let currentColor = 1;
const currentTurnText = document.getElementById("current-turn");
const passButton = document.getElementById("pass");

const changeTurn = () => {
  currentColor = 3 - currentColor;
  
  if (currentColor === 1) {
    currentTurnText.textContent = "��";
  } else {
    currentTurnText.textContent = "��";
  }
}

const getReversibleStones = (idx) => {
  //�N���b�N�����}�X���猩�āA�e�����Ƀ}�X���������邩�����炩���ߌv�Z����
  //squareNums�̒�`�͂�╡�G�Ȃ̂ŁA���������R�s�[�A���h�y�[�X�g�ł��\���܂���
  const squareNums = [
    7 - (idx % 8),
    Math.min(7 - (idx % 8), (56 + (idx % 8) - idx) / 8),
    (56 + (idx % 8) - idx) / 8,
    Math.min(idx % 8, (56 + (idx % 8) - idx) / 8),
    idx % 8,
    Math.min(idx % 8, (idx - (idx % 8)) / 8),
    (idx - (idx % 8)) / 8,
    Math.min(7 - (idx % 8), (idx - (idx % 8)) / 8),
  ];
  //for�����[�v�̋K�����߂邽�߂̃p�����[�^��`
  const parameters = [1, 9, 8, 7, -1, -9, -8, -7];

  //�������牺�̃��W�b�N�͂����O�ɓǂݍ��݂܂��傤
  //�Ђ�����Ԃ��邱�Ƃ��m�肵���΂̏�������z��
  let results = [];

  //8�����ւ̑����̂��߂�for��
  for (let i = 0; i < 8; i++) {
    //�Ђ�����Ԃ���\���̂���΂̏�������z��
    const box = [];
    //���ݒ��ׂĂ�������ɂ����}�X�����邩
    const squareNum = squareNums[i];
    const param = parameters[i];
    //�ЂƂׂ̐΂̏��
    const nextStoneState = stoneStateList[idx + param];

    //�t���[�}��[2][3]�F�ׂɐ΂����邩 �y�� �ׂ̐΂�����̐F�� -> �ǂ���ł��Ȃ��ꍇ�͎��̃��[�v��
    if (nextStoneState === 0 || nextStoneState === currentColor) continue;
    //�ׂ̐΂̔ԍ������{�b�N�X�Ɋi�[
    box.push(idx + param);

    //�t���[�}[4][5]�̃��[�v������
    for (let j = 0; j < squareNum - 1; j++) {
      const targetIdx = idx + param * 2 + param * j;
      const targetColor = stoneStateList[targetIdx];
      //�t���[�}��[4]�F����ɗׂɐ΂����邩 -> �Ȃ���Ύ��̃��[�v��
      if (targetColor === 0) continue;
      //�t���[�}��[5]�F����ɗׂɂ���΂�����̐F��
      if (targetColor === currentColor) {
        //�����̐F�Ȃ牼�{�b�N�X�̐΂��Ђ�����Ԃ��邱�Ƃ��m��
        results = results.concat(box);
        break;
      } else {
        //����̐F�Ȃ牼�{�b�N�X�ɂ��̐΂̔ԍ����i�[
        box.push(targetIdx);
      }
    }
  }
  //�Ђ�����Ԃ���Ɗm�肵���΂̔ԍ���߂�l�ɂ���
  return results;
};

const onClickSquare = (index) => {
  //�Ђ�����Ԃ���΂̐����擾
  const reversibleStones = getReversibleStones(index);

  //���̐΂����邩�A�u�����Ƃ��ɂЂ�����Ԃ���΂��Ȃ��ꍇ�͒u���Ȃ����b�Z�[�W���o��
  if (stoneStateList[index] !== 0 || !reversibleStones.length) {
    alert("�����ɂ͒u���Ȃ���I");
    return;
  }

  //�����̐΂�u�� 
  stoneStateList[index] = currentColor;
  document
    .querySelector(`[data-index='${index}']`)
    .setAttribute("data-state", currentColor);

  //����̐΂��Ђ�����Ԃ� = stoneStateList�����HTML�v�f�̏�Ԃ����݂̃^�[���̐F�ɕύX����
  reversibleStones.forEach((key) => {
    stoneStateList[key] = currentColor;
    document.querySelector(`[data-index='${key}']`).setAttribute("data-state", currentColor);
  });

  //�����Ֆʂ������ς���������A�W�v���ăQ�[�����I������
  if (stoneStateList.every((state) => state !== 0)) {
    const blackStonesNum = stoneStateList.filter(state => state === 1).length;
    const whiteStonesNum = 64 - whiteStonesNum;

    let winnerText = "";
    if (blackStonesNum > whiteStonesNum) {
      winnerText = "���̏����ł��I";
    } else if (blackStonesNum < whiteStonesNum) {
      winnerText = "���̏����ł��I";
    } else {
      winnerText = "���������ł�";
    }

    alert(`�Q�[���I���ł��B��${whiteStonesNum}�A��${blackStonesNum}�ŁA${winnerText}`)
  }

  //�Q�[�����s�Ȃ瑊��̃^�[���ɂ���
  changeTurn();
}

const createSquares = () => {
  for (let i = 0; i < 64; i++) {
    const square = squareTemplate.cloneNode(true);
    square.removeAttribute("id");
    stage.appendChild(square);

    const stone = square.querySelector('.stone');

    let defaultState;
    //i�̒l�ɂ���ăf�t�H���g�̐΂̏�Ԃ𕪊򂷂�
    if (i == 27 || i == 36) {
      defaultState = 1;
    } else if (i == 28 || i == 35) {
      defaultState = 2;
    } else {
      defaultState = 0;
    }

    stone.setAttribute("data-state", defaultState);
    stone.setAttribute("data-index", i); //�C���f�b�N�X�ԍ���HTML�v�f�ɕێ�������
    stoneStateList.push(defaultState); //�����l��z��Ɋi�[

    square.addEventListener('click', () => {
      onClickSquare(i);
    });
  }
}

window.onload = () => {
  createSquares();
  passButton.addEventListener("click", changeTurn)
}