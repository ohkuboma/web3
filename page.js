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
    
    // コード実行ボタンの設定（もしあれば）
    setupCodeRunButtons();
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
            
            const targetPosition = document.getElementById(heading.id).offsetTop - 20;
            
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
            
            const targetPosition = document.getElementById(heading.id).offsetTop - 20;
            
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
}

// 目次のアクティブな項目を更新
function updateActiveTableOfContents(scrollPosition) {
    // h2とh3の両方を取得するように変更
    const headings = document.querySelectorAll('.content h2, .content h3');
    const tocLinks = document.querySelectorAll('.toc a');
    
    if (!headings.length || !tocLinks.length) return;
    
    // 全てのアクティブクラスをリセット
    tocLinks.forEach(link => link.classList.remove('active'));
    
    // 現在のスクロール位置に基づいて、アクティブな見出しを見つける
    let activeHeadingIndex = -1;
    let activeHeading = null;
    
    headings.forEach((heading) => {
        const headingPosition = heading.offsetTop;
        
        // 少し余裕を持たせてスクロール位置と比較
        if (scrollPosition >= headingPosition - 100) {
            activeHeading = heading;
        }
    });
    
    // アクティブな見出しがあれば、対応する目次項目をハイライト
    if (activeHeading) {
        const activeLink = document.querySelector(`.toc a[href="#${activeHeading.id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
            // h3がアクティブな場合、親のh2も部分的にアクティブに
            if (activeHeading.tagName.toLowerCase() === 'h3') {
                const parentH2Item = activeLink.closest('.toc-h3-list').parentElement;
                if (parentH2Item) {
                    const parentH2Link = parentH2Item.querySelector('a[data-level="h2"]');
                    if (parentH2Link) {
                        parentH2Link.classList.add('parent-active');
                    }
                }
            }
        }
    } else if (tocLinks.length) {
        // ページの最上部では最初の項目をアクティブに
        tocLinks[0].classList.add('active');
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

// コード実行ボタンの設定（もしコード実行機能を追加する場合）
function setupCodeRunButtons() {
    const runButtons = document.querySelectorAll('.run-code-button');
    
    runButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.parentElement.querySelector('code');
            if (!codeBlock) return;
            
            const code = codeBlock.textContent;
            executeCode(code, this.dataset.language || 'python');
        });
    });
}

// コードを実行する関数（必要に応じて実装）
function executeCode(code, language) {
    // ここにコード実行のロジックを実装
    // 例：Python用の実行環境への接続やコンソール出力の表示など
    console.log(`Executing ${language} code:`, code);
    
    // 実装例：結果表示エリアがあれば更新
    const outputElement = document.querySelector('.code-output');
    if (outputElement) {
        // 実際の実装では、サーバーサイドでコードを実行するか
        // または適切なライブラリを使用してクライアントサイドで実行
        outputElement.textContent = '// ここに実行結果が表示されます';
    }
}

// コードブロックのハイライト機能
function highlightCode() {
    // シンタックスハイライトライブラリを使用している場合はここで初期化
    // 例：Prism.jsやhighlight.jsなど
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

// ページ読み込み完了時の追加処理
window.addEventListener('load', function() {
    // コードハイライトの適用
    highlightCode();
    
    // 初期スクロール位置に基づくアクティブ項目の設定
    updateActiveTableOfContents(window.scrollY);
});