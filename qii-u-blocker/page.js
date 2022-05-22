// standard-software/partsjs at v10.7.0
// https://github.com/standard-software/partsjs/tree/v10.7.0

const _deleteIndex = (
  array, indexStart, indexEnd = indexStart,
) => {
  array.splice(indexStart, indexEnd - indexStart + 1);
  return array;
};

const _indexOfFirst = (str, search, indexStart = 0) => {
  if (search === '') {
    return -1;
  }
  return str.indexOf(search, indexStart);
};

const _indexOfLast = (
  str, search, indexStart = _max([0, str.length - 1]),
) => {
  if (search === '') {
    return -1;
  }
  return str.lastIndexOf(search, indexStart);
};

const _subIndex = (
  str, indexStart, indexEnd = indexStart,
) => {
  return str.substring(indexStart, indexEnd + 1);
};

const _subLength = (
  str, index, length = str.length - index,
) => {
  return str.substring(index, index + length);
};

const _subLastDelimFirst = (str, delimiter) => {
  const index = _indexOfFirst(str, delimiter);
  if (index === -1) {
    return '';
  } else {
    return _subLength(str, index + delimiter.length);
  }
};

const _subFirstDelimFirst = (str, delimiter) => {
  const index = _indexOfFirst(str, delimiter);
  if (index === -1) {
    return '';
  } else {
    return _subIndex(str, 0, index - 1);
  }
};

window.addEventListener('load', () => {

  qiiUBlockMain();
  const observer = new MutationObserver(records => {

    qiiUBlockMain();

  });

  observer.observe(document, {
    childList: true,
    subtree: true
  })
});

const getQiitaHomePageType = () => {
  let pageType = '';
  if (location.href === 'https://qiita.com/') {
    pageType = `ホーム`
  } else if (location.href === 'https://qiita.com/about') {
    pageType = `アバウト`
  } else if (location.href === 'https://qiita.com/terms') {
    pageType = `利用規約`
  } else if (location.href === 'https://qiita.com/privacy') {
    pageType = `プライバシーポリシー`
  } else if (location.href === 'https://qiita.com/asct') {
    pageType = `特定商取引法に基づく表記`
  } else if (location.href === 'https://qiita.com/release-notes') {
    pageType = `リリースノート`
  } else if (location.href.startsWith('https://qiita.com/timeline')) {
    pageType = `タイムライン`
  } else if (location.href.startsWith('https://qiita.com/trend')) {
    pageType = `トレンド`
  } else if (location.href.startsWith('https://qiita.com/question-')) {
    pageType = `質問`
  } else if (location.href.startsWith('https://qiita.com/organizations')) {
    pageType = `Organization`
  } else if (location.href.startsWith('https://qiita.com/official-events')) {
    pageType = `イベント`
  } else if (location.href.startsWith('https://qiita.com/tags')) {
    pageType = `タグ`
  } else if (location.href.startsWith('https://qiita.com/advent-calendar')) {
    pageType = `アドベントカレンダー`
  } else if (location.href.startsWith('https://qiita.com/qiita-award')) {
    pageType = `表彰プログラム`
  } else if (location.href.startsWith('https://qiita.com/api')) {
    pageType = `API`
  }

  if (pageType === ``) {
    if (location.href.includes(`/items/`)) {
      pageType = `投稿記事`;
    } else if (location.href.includes(`/questions/`)) {
      pageType = `質問記事`;
    }
  }

  return pageType;
};

const buttonBorderColor = `#F3CEAA`;
const buttonTextColor = `#F2B379`;


const qiiUBlockMain = () => {

  const pageType = getQiitaHomePageType();

  console.log(
    `chrome-qii-u-blocker`,
    // location.href,
    pageType,
  );

  chrome.storage.local.get('qiiubloler_users', (data) => {
    let blockUsers = data.qiiubloler_users;
    if(typeof blockUsers == `undefined`) {
      blockUsers = [];
    }

    if (['ホーム', `タイムライン`, `トレンド`].includes(pageType)) {
      const articleWriterList = document.querySelectorAll("article > header > a");
      for (const element of Array.from(articleWriterList)) {
        if (!element) { continue; }
        const targetNode = element.parentNode.parentNode;

        const linkName = element.getAttribute('href');
        let hitFlag = false;
        for (const userName of blockUsers) {
          if (`/${userName}` === linkName) {
            hitFlag = true;
            break;
          }
        }
        if (hitFlag) {
          if (targetNode.hasAttribute(`qiiublock`)) {continue;}
          console.log(
            `chrome-qii-u-blocker Hit linkName:${linkName}`,
          );

          targetNode.setAttribute('qiiublock', `true`);
          for (let i = 0; i < targetNode.childNodes.length; i+=1) {
            targetNode.childNodes[i].style.display = 'none';
          }

          const button = document.createElement('button');
          button.className = `qiiublocker-button`;
          button.style.position = `absolute`;
          button.style.top = `0`;
          button.style.left = `0`;
          button.style.width = `100%`;
          button.style.height = `100%`;

          const buttonText = document.createElement(`div`);
          buttonText.textContent = `Qii-U-Blocker`
          button.appendChild(buttonText);

          // ボタンの特殊デザイン
          button.style.backgroundImage = `linear-gradient(45deg, ${buttonBorderColor} 10%, white 10%, white 50%, ${buttonBorderColor} 50%, ${buttonBorderColor} 60%, white 60%)`;
          button.style.backgroundSize = `10px 10px`;
          button.style.paddingLeft = `8px`;
          button.style.paddingRight = `8px`;
          button.style.border = `1px solid ${buttonBorderColor}`;
          buttonText.style.backgroundColor = `white`;
          buttonText.style.width = `100%`;
          buttonText.style.lineHeight = `20px`;
          buttonText.style.color = `${buttonTextColor}`;

          button.onclick = (e) => {
            // * targetNode === button.parentNode
            if (button.parentNode.getAttribute('qiiublock') === `true`) {
              button.parentNode.setAttribute('qiiublock', `false`);
              button.style.height = `32px`;
              for (let i = 0; i < button.parentNode.childNodes.length; i+=1) {
                if (button.parentNode.childNodes[i] === button) { continue; }
                button.parentNode.childNodes[i].style.display = '';
              }
              button.parentNode.style.paddingTop = `32px`;
            } else {
              button.parentNode.setAttribute('qiiublock', `true`);
              button.style.height = `100%`;
              for (let i = 0; i < button.parentNode.childNodes.length; i+=1) {
                if (button.parentNode.childNodes[i] === button) { continue; }
                button.parentNode.childNodes[i].style.display = 'none';
              }
              button.parentNode.style.paddingTop = ``;
            }
          }
          targetNode.appendChild(button);
        } else {
          if (!targetNode.hasAttribute(`qiiublock`)) {continue;}
          targetNode.removeAttribute(`qiiublock`);
          const button = targetNode.querySelector(`.qiiublocker-button`)
          if (button) {
            button.remove();
          }
          for (let i = 0; i < targetNode.childNodes.length; i+=1) {
            targetNode.childNodes[i].style.display = '';
          }
        }
      }
    } else if ([`投稿記事`].includes(pageType)) {

      const commentWriterList = document.querySelectorAll("#comments .css-vdedeo a:first-child");
      for (const element of Array.from(commentWriterList)) {
        if (!element) { continue; }
        const targetNode = element.parentNode.parentNode.parentNode;

        const linkName = element.getAttribute('href');
        let hitFlag = false;
        for (const userName of blockUsers) {
          if (`/${userName}` === linkName) {
            hitFlag = true;
            break;
          }
        }
        if (hitFlag) {
          console.log(
            `chrome-qii-u-blocker Hit linkName:${linkName}`,
          );

          if (targetNode.hasAttribute(`qiiublock`)) {continue;}

          targetNode.setAttribute('qiiublock', `true`);
          for (let i = 0; i < targetNode.childNodes.length; i+=1) {
            targetNode.childNodes[i].style.display = 'none';
          }

          const button = document.createElement('button');
          button.className = `qiiublocker-button`;
          button.style.height = `32px`;
          button.style.width = `100%`;

          const buttonText = document.createElement(`div`);
          buttonText.textContent = `Qii-U-Blocker`
          button.appendChild(buttonText);

          // ボタンの特殊デザイン
          button.style.backgroundImage = `linear-gradient(45deg, ${buttonBorderColor} 10%, white 10%, white 50%, ${buttonBorderColor} 50%, ${buttonBorderColor} 60%, white 60%)`;
          button.style.backgroundSize = `10px 10px`;
          button.style.paddingLeft = `8px`;
          button.style.paddingRight = `8px`;
          button.style.border = `1px solid ${buttonBorderColor}`;
          buttonText.style.backgroundColor = `white`;
          buttonText.style.width = `100%`;
          buttonText.style.lineHeight = `20px`;
          buttonText.style.color = `${buttonTextColor}`;

          // 変化属性
          button.style.marginBottom = ``;

          button.onclick = (e) => {
            if (button.parentNode.getAttribute('qiiublock') === `true`) {
              button.parentNode.setAttribute('qiiublock', `false`);
              for (let i = 0; i < button.parentNode.childNodes.length; i+=1) {
                if (button.parentNode.childNodes[i] === button) { continue; }
                button.parentNode.childNodes[i].style.display = '';
              }
              button.style.marginBottom = `8px`;
            } else {
              button.parentNode.setAttribute('qiiublock', `true`);
              for (let i = 0; i < button.parentNode.childNodes.length; i+=1) {
                if (button.parentNode.childNodes[i] === button) { continue; }
                button.parentNode.childNodes[i].style.display = 'none';
              }
              button.style.marginBottom = ``;
            }
          }
          targetNode.insertBefore(button, targetNode.firstChild);
        } else {
          if (!targetNode.hasAttribute(`qiiublock`)) {continue;}
          targetNode.removeAttribute(`qiiublock`);
          const button = targetNode.querySelector(`.qiiublocker-button`)
          if (button) {
            button.remove();
          }
          for (let i = 0; i < targetNode.childNodes.length; i+=1) {
            targetNode.childNodes[i].style.display = '';
          }
        }
      }
    } else if (pageType === ``) {
      // ユーザーページと想定

      let pageUserName = _subLastDelimFirst(location.href, 'qiita.com/');
      if (pageUserName.includes('/')) {
        pageUserName = _subFirstDelimFirst(pageUserName, '/');
      }

      let userBlocked = false;
      for (const userName of blockUsers) {
        if (userName === pageUserName) {
          userBlocked = true;
        }
      }

      console.log(
        `chrome-qii-u-blocker ユーザーページ:${pageUserName} userBlocked:${userBlocked}`,
      );

      const buttonList = document.querySelectorAll("button");
      for (const element of Array.from(buttonList)) {
        if (!element) { continue; }
        if (element.id === `qiiublocker-button`) { return; }
      }

      const ankerList = document.querySelectorAll(`a[href^="/${pageUserName}/feed"]`);
      for (const element of Array.from(ankerList)) {
        if (!element) { continue; }

        const targetNode = element.parentNode.parentNode.parentNode;

        const button = document.createElement('button');
        button.id = `qiiublocker-button`;
        button.style.width = `100%`;
        button.style.padding = `8px`;

        const buttonText = document.createElement(`div`);
        button.appendChild(buttonText);

        // ボタンの特殊デザイン
        button.style.backgroundImage = `linear-gradient(45deg, ${buttonBorderColor} 10%, white 10%, white 50%, ${buttonBorderColor} 50%, ${buttonBorderColor} 60%, white 60%)`;
        button.style.backgroundSize = `10px 10px`;
        button.style.paddingLeft = `8px`;
        button.style.paddingRight = `8px`;
        button.style.border = `1px solid ${buttonBorderColor}`;
        buttonText.style.backgroundColor = `white`;
        buttonText.style.width = `100%`;
        buttonText.style.lineHeight = `20px`;
        buttonText.style.color = `${buttonTextColor}`;

        if (userBlocked === false) {
          buttonText.textContent = `Qii-U-Blockerでブロックする`
          button.onclick = () => {
            chrome.storage.local.get('qiiubloler_users', (data) => {
              let blockUsers = data.qiiubloler_users;
              if(typeof blockUsers == `undefined`) {
                blockUsers = [];
              }

              blockUsers.push(pageUserName);

              chrome.storage.local.set({'qiiubloler_users': blockUsers}, () => {
                button.remove();
              });
            });
          }
        } else {
          buttonText.textContent = `Qii-U-Blockerのブロックを解除`
          button.onclick = () => {
            chrome.storage.local.get('qiiubloler_users', (data) => {
              let blockUsers = data.qiiubloler_users;
              if(typeof blockUsers == `undefined`) {
                blockUsers = [];
              } else {
                const index = blockUsers.indexOf(pageUserName);
                if (index !== -1) {
                  _deleteIndex(blockUsers, index);
                }
              }
              chrome.storage.local.set({'qiiubloler_users': blockUsers}, () => {
                button.remove();
              });
            });
          }
        }

        targetNode.appendChild(button)

      }
    }

  });
}

