// === パスワード保護ここから ===
// 2025-10 版：ブラウザのみで暗号化・復号
// コマリさま用 ID:web3 / PW:1128606

// 暗号化済みデータ（復号にはマスターパスワードが必要）
const ENCRYPTED_DATA = {
  cipher: "7r7A2NPDekj3Zf19pCSMtvD0DLXhyM05UjVr8yR7Xpg=",
  iv: "pRyO3ufhAZbQw+05",
  salt: "zj6WIMC4w6Ybng92QO8XzA=="
};

// --- 以下は変更不要 ---
const MASTER_PROMPT = "マスターパスワードを入力してください:";

function b64ToBuf(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}
function bufToStr(buf) {
  return new TextDecoder().decode(buf);
}
async function deriveKey(pass, saltBuf) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(pass),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltBuf, iterations: 200000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
}
async function tryDecrypt(encryptedObj, pass) {
  try {
    const salt = b64ToBuf(encryptedObj.salt);
    const iv = b64ToBuf(encryptedObj.iv);
    const cipherBuf = b64ToBuf(encryptedObj.cipher);
    const key = await deriveKey(pass, salt);
    const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipherBuf);
    return bufToStr(plainBuf);
  } catch (e) {
    return null;
  }
}

(async function() {
  const ok = sessionStorage.getItem("authorized");
  if (ok === "true") return;

  const pass = prompt(MASTER_PROMPT);
  if (!pass) {
    alert("キャンセルされました。");
    location.href = "about:blank";
    return;
  }

  const decrypted = await tryDecrypt(ENCRYPTED_DATA, pass);
  if (!decrypted) {
    alert("パスワードが違います。");
    location.href = "https://vercel.com/";
    return;
  }

  sessionStorage.setItem("authorized", "true");
  alert("ようこそ、コマリさま。");

  // ここに復号結果を使いたい処理を書く（必要なら）
  // console.log("復号結果:", decrypted);
})();
// === パスワード保護ここまで ===



document.addEventListener('DOMContentLoaded', function() {
    // 目次の生成
    generateTableOfContents();
    
    // スクロール時のアクティブな見出しの更新
    window.addEventListener('scroll', handleScroll);
    
    // トップへ戻るボタンの表示制御
    setupTopButton();
    
    // アクティブなナビゲーションボタンをハイライト
    highlightActiveNavButton();
    
    // コラムにホバーエフェクトを追加
    setupColumnHoverEffects();
    
    // ビデオリンクのホバーエフェクト
    setupVideoLinkEffects();
    
    // コードサンプルのコピー機能
    setupCodeCopyButtons();
});

// 目次の自動生成
function generateTableOfContents() {
    // h2とh3の両方を取得するように変更
    const h2Headings = document.querySelectorAll('.content h2');
    const h3Headings = document.querySelectorAll('.content h3');
    const tocContainer = document.getElementById('tableOfContents');
    
    if (!tocContainer || (h2Headings.length === 0 && h3Headings.length === 0)) return;
    
    tocContainer.innerHTML = ''; // 既存の目次をクリア
    
    let currentH2Item = null;
    let currentH2List = null;
    
    // まずh2見出しを処理
    h2Headings.forEach(heading => {
        // IDがない場合は生成
        if (!heading.id) {
            heading.id = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        }
        
        const listItem = document.createElement('li');
        listItem.className = 'toc-h2';
        const link = document.createElement('a');
        
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.dataset.level = 'h2';
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPosition = document.getElementById(heading.id).offsetTop - 100;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
        
        listItem.appendChild(link);
        tocContainer.appendChild(listItem);
        
        // h3のネスト用に現在のh2項目を保存
        currentH2Item = listItem;
        
        // h3用のサブリストを作成
        currentH2List = document.createElement('ul');
        currentH2List.className = 'toc-h3-list';
        currentH2Item.appendChild(currentH2List);
    });
    
    // 次にh3見出しを処理して適切なh2の下に配置
    h3Headings.forEach(heading => {
        // IDがない場合は生成
        if (!heading.id) {
            heading.id = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        }
        
        const listItem = document.createElement('li');
        listItem.className = 'toc-h3';
        const link = document.createElement('a');
        
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.dataset.level = 'h3';
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPosition = document.getElementById(heading.id).offsetTop - 100;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
        
        listItem.appendChild(link);
        
        // このh3の前にある最後のh2を見つける
        let previousH2 = null;
        let h2Found = false;
        
        h2Headings.forEach(h2 => {
            if (h2.offsetTop < heading.offsetTop && !h2Found) {
                previousH2 = h2;
            } else {
                h2Found = true;
            }
        });
        
        if (previousH2) {
            // 該当するh2のIDを取得
            const h2Id = previousH2.id;
            // h2に対応するTOC項目を見つける
            const h2TocItem = Array.from(tocContainer.querySelectorAll('.toc-h2 a')).find(
                a => a.getAttribute('href') === `#${h2Id}`
            );
            
            if (h2TocItem) {
                const h2ListItem = h2TocItem.parentElement;
                const h3List = h2ListItem.querySelector('.toc-h3-list');
                if (h3List) {
                    h3List.appendChild(listItem);
                }
            } else {
                tocContainer.appendChild(listItem); // 適切なh2が見つからない場合は直接追加
            }
        } else {
            tocContainer.appendChild(listItem); // 適切なh2が見つからない場合は直接追加
        }
    });
}

// スクロール時の処理
function handleScroll() {
    const scrollPosition = window.scrollY;
    
    // 目次のアクティブ項目の更新
    updateActiveTableOfContents(scrollPosition);
    
    // トップへ戻るボタンの表示/非表示
    updateTopButton(scrollPosition);
    
    // ヘッダーのスクロール効果
    updateHeaderOnScroll(scrollPosition);
}

// ヘッダーのスクロール効果
function updateHeaderOnScroll(scrollPosition) {
    const header = document.querySelector('header');
    
    if (scrollPosition > 50) {
        header.classList.add('compact');
    } else {
        header.classList.remove('compact');
    }
}

// 目次のアクティブな項目を更新
function updateActiveTableOfContents(scrollPosition) {
    // h2とh3の両方を取得するように変更
    const headings = document.querySelectorAll('.content h2, .content h3');
    const tocLinks = document.querySelectorAll('.toc a');
    
    if (!headings.length || !tocLinks.length) return;
    
    // 全てのアクティブクラスをリセット
    tocLinks.forEach(link => {
        link.classList.remove('active');
        link.classList.remove('parent-active');
    });
    
    // 現在のスクロール位置に基づいて、アクティブな見出しを見つける
    let activeHeading = null;
    const offset = 150; // ヘッダーの高さなどを考慮したオフセット
    
    for (let i = headings.length - 1; i >= 0; i--) {
        if (scrollPosition >= headings[i].offsetTop - offset) {
            activeHeading = headings[i];
            break;
        }
    }
    
    // アクティブな見出しがあれば、対応する目次項目をハイライト
    if (activeHeading) {
        const activeLink = document.querySelector(`.toc a[href="#${activeHeading.id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
            // h3がアクティブな場合、親のh2も部分的にアクティブに
            if (activeHeading.tagName.toLowerCase() === 'h3') {
                const parentH2Item = activeLink.closest('.toc-h3-list')?.parentElement;
                if (parentH2Item) {
                    const parentH2Link = parentH2Item.querySelector('a[data-level="h2"]');
                    if (parentH2Link) {
                        parentH2Link.classList.add('parent-active');
                    }
                }
            }
        }
    } else if (headings.length > 0 && scrollPosition < headings[0].offsetTop - offset) {
        // ページの最上部では最初の項目をアクティブに
        tocLinks[0]?.classList.add('active');
    }
}

// トップへ戻るボタンの設定
function setupTopButton() {
    const topButton = document.querySelector('.top-button');
    
    if (!topButton) return;
    
    // スクロール位置に応じてボタンの表示/非表示を切り替え
    window.addEventListener('scroll', function() {
        updateTopButton(window.scrollY);
    });
    
    // トップへ戻るボタンのクリックイベント
    topButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// トップへ戻るボタンの表示/非表示を更新
function updateTopButton(scrollPosition) {
    const topButton = document.querySelector('.top-button');
    
    if (!topButton) return;
    
    if (scrollPosition > 300) {
        topButton.classList.add('visible');
    } else {
        topButton.classList.remove('visible');
    }
}

// アクティブなナビゲーションボタンをハイライト
function highlightActiveNavButton() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const navButtons = document.querySelectorAll('.lecture-buttons button');
    
    navButtons.forEach(button => {
        const onClickAttr = button.getAttribute('onclick') || '';
        const buttonLink = onClickAttr.match(/location\.href=\'([^\']+)\'/);
        
        if (buttonLink && (buttonLink[1] === currentPage || 
            (currentPage === 'index.html' && buttonLink[1] === 'index.html'))) {
            button.classList.add('active-nav');
        }
    });
}

// コラムにホバーエフェクトを追加
function setupColumnHoverEffects() {
    const columns = document.querySelectorAll('.column');
    
    columns.forEach(column => {
        column.addEventListener('mouseenter', function() {
            this.classList.add('column-hover');
        });
        
        column.addEventListener('mouseleave', function() {
            this.classList.remove('column-hover');
        });
    });
}

// ビデオリンクのホバーエフェクト
function setupVideoLinkEffects() {
    const videoLinks = document.querySelectorAll('.video-link');
    
    videoLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.video-icon');
            if (icon) {
                icon.classList.add('pulse');
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.video-icon');
            if (icon) {
                icon.classList.remove('pulse');
            }
        });
    });
}

// コードサンプルのコピー機能
function setupCodeCopyButtons() {
    const codeSamples = document.querySelectorAll('.code-sample pre');
    
    codeSamples.forEach(sample => {
        // コピーボタンを作成
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'コードをコピー';
        
        // サンプルの親要素にボタンを追加
        sample.parentNode.style.position = 'relative';
        sample.parentNode.appendChild(copyButton);
        
        // コピーボタンのクリックイベント
        copyButton.addEventListener('click', function() {
            const code = sample.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                // コピー成功時のフィードバック
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.classList.add('copied');
                
                // 2秒後に元に戻す
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i>';
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    });
}

// ページ読み込み完了時の追加処理
window.addEventListener('load', function() {
    // 初期スクロール位置に基づくアクティブ項目の設定
    updateActiveTableOfContents(window.scrollY);
    
    // ページ遷移アニメーション
    document.body.classList.add('page-loaded');
    
    // コードブロックのシンタックスハイライト（もし外部ライブラリを使用していれば）
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});
