// 图片懒加载功能
function initLazyLoad() {
    // 检查浏览器是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.onload = function() {
                            // 隐藏加载覆盖层
                            const overlay = img.parentElement.querySelector('.image-loading-overlay');
                            if (overlay) {
                                overlay.style.opacity = '0';
                                setTimeout(() => {
                                    overlay.style.display = 'none';
                                }, 300);
                            }
                        };
                        img.removeAttribute('data-src');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        // 观察所有带有data-src属性的图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 降级方案：使用滚动事件
        let lazyImages = [].slice.call(document.querySelectorAll('img[data-src]'));
        
        if ('requestAnimationFrame' in window) {
            window.addEventListener('scroll', () => {
                requestAnimationFrame(() => {
                    lazyImages.forEach(img => {
                        if (isInViewport(img)) {
                            img.src = img.getAttribute('data-src');
                            img.onload = function() {
                                // 隐藏加载覆盖层
                                const overlay = img.parentElement.querySelector('.image-loading-overlay');
                                if (overlay) {
                                    overlay.style.opacity = '0';
                                    setTimeout(() => {
                                        overlay.style.display = 'none';
                                    }, 300);
                                }
                            };
                            img.removeAttribute('data-src');
                            lazyImages = lazyImages.filter(item => item !== img);
                        }
                    });
                });
            });
        } else {
            window.addEventListener('scroll', () => {
                lazyImages.forEach(img => {
                    if (isInViewport(img)) {
                        img.src = img.getAttribute('data-src');
                        img.onload = function() {
                            // 隐藏加载覆盖层
                            const overlay = img.parentElement.querySelector('.image-loading-overlay');
                            if (overlay) {
                                overlay.style.opacity = '0';
                                setTimeout(() => {
                                    overlay.style.display = 'none';
                                }, 300);
                            }
                        };
                        img.removeAttribute('data-src');
                        lazyImages = lazyImages.filter(item => item !== img);
                    }
                });
            });
        }
        
        // 初始检查
        lazyImages.forEach(img => {
            if (isInViewport(img)) {
                img.src = img.getAttribute('data-src');
                img.onload = function() {
                    // 隐藏加载覆盖层
                    const overlay = img.parentElement.querySelector('.image-loading-overlay');
                    if (overlay) {
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            overlay.style.display = 'none';
                        }, 300);
                    }
                };
                img.removeAttribute('data-src');
                lazyImages = lazyImages.filter(item => item !== img);
            }
        });
    }
}

// 检查元素是否在视口中
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 当DOM加载完成时初始化懒加载
document.addEventListener('DOMContentLoaded', initLazyLoad);