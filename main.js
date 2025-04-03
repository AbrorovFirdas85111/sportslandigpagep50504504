// Webtec Sports News Website Main.js  
"use strict";  
// Global Configurations  
const API_URL = "https://api.sportsnews.com/v1";  
const DEFAULT_CATEGORY = "football";  
let currentPage = 1;  
let articlesPerPage = 10;  
let newsData = [];  
// Listen for DOM to be fully loaded  
document.addEventListener('DOMContentLoaded', init);  
// Initialize the application  
function init() {  
loadArticles(DEFAULT_CATEGORY, currentPage);  

setupEventListeners();  

initializeCarousel();  

}  
// Utility function: Get element by selector  
function $(selector) {  
return document.querySelector(selector);  

}  
// Utility function: Get all elements matching selector  
function $all(selector) {  
return document.querySelectorAll(selector);  

}  
// Load articles for a given category and page  
async function loadArticles(category, page) {  
try {  

    const response = await fetch(`${API_URL}/articles?category=${category}&amp;page=${page}&amp;limit=${articlesPerPage}`);  

    if (!response.ok) throw new Error(&quot;Network response error&quot;);  

    const data = await response.json();  

    newsData = data.articles;  

    renderArticles(newsData);  

} catch (error) {  

    console.error(&quot;Error loading articles:&quot;, error);  

}  

}  
// Render articles to the DOM  
function renderArticles(articles) {  
const articlesContainer = $(&#39;#articles-container&#39;);  

articlesContainer.innerHTML = &quot;&quot;;  

articles.forEach(article =&gt; {  

    const articleElement = createArticleElement(article);  

    articlesContainer.appendChild(articleElement);  

});  

updatePagination();  

}  
// Create a DOM element for an article  
function createArticleElement(article) {  
const articleDiv = document.createElement(&#39;div&#39;);  

articleDiv.classList.add(&#39;article&#39;);  

const title = document.createElement(&#39;h2&#39;);  

title.textContent = article.title;  

articleDiv.appendChild(title);  

const meta = document.createElement(&#39;div&#39;);  

meta.classList.add(&#39;meta&#39;);  

meta.textContent = `By ${article.author} on ${new Date(article.published_at).toLocaleDateString()}`;  

articleDiv.appendChild(meta);  

const summary = document.createElement(&#39;p&#39;);  

summary.textContent = article.summary;  

articleDiv.appendChild(summary);  

if (article.image_url) {  

    const img = document.createElement(&#39;img&#39;);  

    img.src = article.image_url;  

    img.alt = article.title;  

    articleDiv.appendChild(img);  

}  

const readMore = document.createElement(&#39;a&#39;);  

readMore.href = article.url;  

readMore.textContent = &quot;Read More&quot;;  

readMore.classList.add(&#39;read-more&#39;);  

articleDiv.appendChild(readMore);  

// Bookmark button  

const bookmarkBtn = document.createElement(&#39;button&#39;);  

bookmarkBtn.textContent = &quot;Bookmark&quot;;  

bookmarkBtn.addEventListener(&#39;click&#39;, () =&gt; toggleBookmark(article));  

articleDiv.appendChild(bookmarkBtn);  

return articleDiv;  

}  
// Update pagination controls  
function updatePagination() {  
const paginationContainer = $(&#39;#pagination&#39;);  

paginationContainer.innerHTML = &quot;&quot;;  

const prevButton = document.createElement('button');  
prevButton.textContent = "Previous";  
prevButton.disabled = (currentPage === 1);  
prevButton.addEventListener('click', () => {  
   if (currentPage &gt; 1) {  

       currentPage--;  

       loadArticles(DEFAULT_CATEGORY, currentPage);  

   }  

});  
paginationContainer.appendChild(prevButton);  
const pageIndicator = document.createElement('span');  
pageIndicator.textContent = Page ${currentPage};  
paginationContainer.appendChild(pageIndicator);  
const nextButton = document.createElement('button');  
nextButton.textContent = "Next";  
nextButton.addEventListener('click', () => {  
   currentPage++;  

   loadArticles(DEFAULT_CATEGORY, currentPage);  

});  
paginationContainer.appendChild(nextButton);  
}  
// Setup event listeners for search and category filtering  
function setupEventListeners() {  
const searchForm = $(&#39;#search-form&#39;);  

if (searchForm) {  

    searchForm.addEventListener(&#39;submit&#39;, function(e) {  

        e.preventDefault();  

        const query = $(&#39;#search-input&#39;).value.trim();  

        if (query) {  

            searchArticles(query);  

        }  

    });  

}  

const categoryButtons = $all(&#39;.category-button&#39;);  

categoryButtons.forEach(button =&gt; {  

    button.addEventListener(&#39;click&#39;, () =&gt; {  

        const category = button.getAttribute(&#39;data-category&#39;);  

        currentPage = 1;  

        loadArticles(category, currentPage);  

    });  

});  

}  
// Search articles by query  
async function searchArticles(query) {  
try {  

    const response = await fetch(`${API_URL}/articles/search?q=${encodeURIComponent(query)}`);  

    if (!response.ok) throw new Error(&quot;Search failed&quot;);  

    const data = await response.json();  

    newsData = data.articles;  

    renderArticles(newsData);  

} catch (error) {  

    console.error(&quot;Error searching articles:&quot;, error);  

}  

}  
// Initialize carousel for featured news  
function initializeCarousel() {  
const carousel = $(&#39;#featured-carousel&#39;);  

if (!carousel) return;  

// Create dummy featured articles from current newsData  

const featuredArticles = newsData.slice(0, 5);  

featuredArticles.forEach(article =&gt; {  

    const slide = document.createElement(&#39;div&#39;);  

    slide.classList.add(&#39;carousel-slide&#39;);  

    slide.style.backgroundImage = `url(${article.image_url || &#39;default.jpg&#39;})`;  

    const caption = document.createElement(&#39;div&#39;);  

    caption.classList.add(&#39;carousel-caption&#39;);  

    caption.textContent = article.title;  

    slide.appendChild(caption);  

    carousel.appendChild(slide);  

});  

startCarousel(carousel);  

}  
// Start carousel animation  
function startCarousel(carousel) {  
let currentSlide = 0;  

const slides = carousel.children;  

const totalSlides = slides.length;  

setInterval(() =&gt; {  

    slides[currentSlide].classList.remove(&#39;active&#39;);  

    currentSlide = (currentSlide + 1) % totalSlides;  

    slides[currentSlide].classList.add(&#39;active&#39;);  

}, 5000);  

}  
// Feature: Bookmark articles  
const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];  
function toggleBookmark(article) {  
const index = bookmarks.findIndex(item =&gt; item.id === article.id);  

if (index !== -1) {  

    bookmarks.splice(index, 1);  

} else {  

    bookmarks.push(article);  

}  

localStorage.setItem(&#39;bookmarks&#39;, JSON.stringify(bookmarks));  

renderBookmarks();  

}  
function renderBookmarks() {  
const bookmarkContainer = $(&#39;#bookmarks&#39;);  

if (!bookmarkContainer) return;  

bookmarkContainer.innerHTML = &quot;&quot;;  

bookmarks.forEach(article =&gt; {  

    const item = document.createElement(&#39;div&#39;);  

    item.classList.add(&#39;bookmark-item&#39;);  

    item.textContent = article.title;  

    item.addEventListener(&#39;click&#39;, () =&gt; {  

        window.open(article.url, &#39;_blank&#39;);  

    });  

    bookmarkContainer.appendChild(item);  

});  

}  
// Feature: Theme switcher  
function toggleTheme() {  
const body = document.body;  

body.classList.toggle(&#39;dark-theme&#39;);  

localStorage.setItem(&#39;theme&#39;, body.classList.contains(&#39;dark-theme&#39;) ? &#39;dark&#39; : &#39;light&#39;);  

}  
function loadTheme() {  
const theme = localStorage.getItem(&#39;theme&#39;) || &#39;light&#39;;  

if (theme === &#39;dark&#39;) {  

    document.body.classList.add(&#39;dark-theme&#39;);  

}  

}  
// Utility: Debounce function to optimize event triggers  
function debounce(func, delay) {  
let timeout;  

return function(...args) {  

    clearTimeout(timeout);  

    timeout = setTimeout(() =&gt; func.apply(this, args), delay);  

}  

}  
// Feature: Live update news ticker  
async function updateNewsTicker() {  
try {  

    const response = await fetch(`${API_URL}/articles/latest`);  

    if (!response.ok) throw new Error(&quot;Ticker update failed&quot;);  

    const data = await response.json();  

    renderNewsTicker(data.articles);  

} catch (error) {  

    console.error(&quot;Error updating news ticker:&quot;, error);  

}  

}  
function renderNewsTicker(articles) {  
const ticker = $(&#39;#news-ticker&#39;);  

if (!ticker) return;  

ticker.innerHTML = &quot;&quot;;  

articles.forEach(article =&gt; {  

    const tickerItem = document.createElement(&#39;span&#39;);  

    tickerItem.textContent = article.title + &quot; • &quot;;  

    ticker.appendChild(tickerItem);  

});  

}  
// Auto refresh news ticker every minute (60000ms)  
setInterval(updateNewsTicker, 60000);  
// Load saved theme on startup  
loadTheme();  
// Feature: Infinite scrolling for articles  
window.addEventListener('scroll', debounce(() => {  
if ((window.innerHeight + window.scrollY) &gt;= document.body.offsetHeight - 500) {  

    currentPage++;  

    loadArticles(DEFAULT_CATEGORY, currentPage);  

}  

}, 200));  
// End of main functionality section  
// Feature: Live commentary section  
function initLiveCommentary() {  
const commentaryContainer = $(&#39;#live-commentary&#39;);  

if (!commentaryContainer) return;  

commentaryContainer.innerHTML = &quot;&lt;h3&gt;Live Commentary&lt;/h3&gt;&lt;div id=&#39;comments&#39;&gt;&lt;/div&gt;&lt;input type=&#39;text&#39; id=&#39;comment-input&#39; placeholder=&#39;Type your comment...&#39;&gt;&lt;button id=&#39;comment-submit&#39;&gt;Submit&lt;/button&gt;&quot;;  

$(&#39;#comment-submit&#39;).addEventListener(&#39;click&#39;, submitComment);  

}  
function submitComment() {  
const commentInput = $(&#39;#comment-input&#39;);  

const commentText = commentInput.value.trim();  

if (!commentText) return;  

addCommentToLive(commentText);  

commentInput.value = &quot;&quot;;  

}  
function addCommentToLive(text) {  
const commentsDiv = $(&#39;#comments&#39;);  

const commentElem = document.createElement(&#39;div&#39;);  

commentElem.classList.add(&#39;comment&#39;);  

commentElem.textContent = text;  

commentsDiv.appendChild(commentElem);  

}  
// Initialize live commentary if the section exists  
initLiveCommentary();  
// Feature: Scroll progress bar  
function initScrollProgress() {  
const progressBar = document.createElement(&#39;div&#39;);  

progressBar.id = &quot;scroll-progress&quot;;  

progressBar.style.position = &quot;fixed&quot;;  

progressBar.style.top = &quot;0&quot;;  

progressBar.style.left = &quot;0&quot;;  

progressBar.style.height = &quot;5px&quot;;  

progressBar.style.backgroundColor = &quot;#29e&quot;;  

progressBar.style.zIndex = &quot;9999&quot;;  

document.body.appendChild(progressBar);  

window.addEventListener(&#39;scroll&#39;, updateScrollProgress);  

}  
function updateScrollProgress() {  
const progressBar = $(&#39;#scroll-progress&#39;);  

if (!progressBar) return;  

const scrollTop = window.scrollY;  

const docHeight = document.body.scrollHeight - window.innerHeight;  

const width = (scrollTop / docHeight) * 100;  

progressBar.style.width = width + &quot;%&quot;;  

}  
// Initialize scroll progress bar on DOMContentLoaded  
initScrollProgress();  
// Feature: Back to top button  
function initBackToTop() {  
const btn = document.createElement(&#39;button&#39;);  

btn.id = &quot;back-to-top&quot;;  

btn.textContent = &quot;↑ Top&quot;;  

btn.style.position = &quot;fixed&quot;;  

btn.style.bottom = &quot;20px&quot;;  

btn.style.right = &quot;20px&quot;;  

btn.style.display = &quot;none&quot;;  

btn.style.zIndex = &quot;10000&quot;;  

document.body.appendChild(btn);  

btn.addEventListener(&#39;click&#39;, () =&gt; window.scrollTo({ top: 0, behavior: &#39;smooth&#39; }));  

window.addEventListener(&#39;scroll&#39;, toggleBackToTop);  

}  
function toggleBackToTop() {  
const btn = $(&#39;#back-to-top&#39;);  

if (!btn) return;  

if (window.scrollY &gt; 300) {  

    btn.style.display = &quot;block&quot;;  

} else {  

    btn.style.display = &quot;none&quot;;  

}  

}  
// Initialize back to top button  
initBackToTop();  
// Feature: Responsive navigation menu toggle  
function initResponsiveMenu() {  
const menuToggle = $(&#39;#menu-toggle&#39;);  

const navMenu = $(&#39;#nav-menu&#39;);  

if (menuToggle &amp;&amp; navMenu) {  

    menuToggle.addEventListener(&#39;click&#39;, () =&gt; {  

        navMenu.classList.toggle(&#39;active&#39;);  

    });  

}  

}  
// Initialize responsive menu  
initResponsiveMenu();  
// Feature: Lazy loading images  
function initLazyLoading() {  
const lazyImages = $all(&#39;img.lazy&#39;);  

const lazyLoad = function() {  

    lazyImages.forEach(img =&gt; {  

        if (img.getBoundingClientRect().top &lt; window.innerHeight + 100) {  

            img.src = img.dataset.src;  

            img.classList.remove(&#39;lazy&#39;);  

        }  

    });  

}  

window.addEventListener(&#39;scroll&#39;, debounce(lazyLoad, 100));  

lazyLoad();  

}  
initLazyLoading();  
// Feature: Video modal for highlight videos  
function initVideoModal() {  
const modal = document.createElement(&#39;div&#39;);  

modal.id = &quot;video-modal&quot;;  

modal.style.display = &quot;none&quot;;  

modal.style.position = &quot;fixed&quot;;  

modal.style.top = &quot;0&quot;;  

modal.style.left = &quot;0&quot;;  

modal.style.width = &quot;100%&quot;;  

modal.style.height = &quot;100%&quot;;  

modal.style.backgroundColor = &quot;rgba(0,0,0,0.8)&quot;;  

modal.style.zIndex = &quot;10000&quot;;  

modal.innerHTML = &quot;&lt;div id=&#39;video-content&#39; style=&#39;position: relative; margin: 50px auto; width: 80%; max-width: 800px;&#39;&gt;&lt;span id=&#39;video-close&#39; style=&#39;position: absolute; top: 10px; right: 10px; cursor: pointer; color: #fff;&#39;&gt;X&lt;/span&gt;&lt;video controls style=&#39;width: 100%;&#39;&gt;&lt;source id=&#39;video-source&#39; src=&#39;&#39; type=&#39;video/mp4&#39;&gt;Your browser does not support the video tag.&lt;/video&gt;&lt;/div&gt;&quot;;  

document.body.appendChild(modal);  

$(&#39;#video-close&#39;).addEventListener(&#39;click&#39;, () =&gt; {  

    modal.style.display = &quot;none&quot;;  

});  

const videoButtons = $all(&#39;.video-button&#39;);  

videoButtons.forEach(button =&gt; {  

    button.addEventListener(&#39;click&#39;, () =&gt; {  

        const videoUrl = button.getAttribute(&#39;data-video-url&#39;);  

        $(&#39;#video-source&#39;).src = videoUrl;  

        modal.style.display = &quot;block&quot;;  

    });  

});  

}  
initVideoModal();  
// Feature: Social sharing buttons functionality  
function initSocialSharing() {  
const shareButtons = $all(&#39;.share-button&#39;);  

shareButtons.forEach(button =&gt; {  

    button.addEventListener(&#39;click&#39;, () =&gt; {  

        const articleUrl = button.getAttribute(&#39;data-url&#39;);  

        const shareText = encodeURIComponent(&quot;Check out this article!&quot;);  

        const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&amp;text=${shareText}`;  

        window.open(shareUrl, &#39;_blank&#39;, &#39;width=600,height=400&#39;);  

    });  

});  

}  
initSocialSharing();  
// Feature: Analytics for user interactions  
function logEvent(eventName, data = {}) {  
console.log(`Event: ${eventName}`, data);  

// In a real implementation, send this data to an analytics server  

}  
// Log page view on load  
logEvent("page_view", { page: window.location.pathname });  
// Feature: Offline detection and notification  
function handleOfflineStatus() {  
if (!navigator.onLine) {  

    displayOfflineNotification();  

}  

}  
window.addEventListener('offline', displayOfflineNotification);  
window.addEventListener('online', removeOfflineNotification);  
function displayOfflineNotification() {  
let notification = $(&#39;#offline-notification&#39;);  

if (!notification) {  

    notification = document.createElement(&#39;div&#39;);  

    notification.id = &quot;offline-notification&quot;;  

    notification.style.position = &quot;fixed&quot;;  

    notification.style.top = &quot;0&quot;;  

    notification.style.width = &quot;100%&quot;;  

    notification.style.backgroundColor = &quot;#f44336&quot;;  

    notification.style.color = &quot;#fff&quot;;  

    notification.style.textAlign = &quot;center&quot;;  

    notification.style.padding = &quot;10px&quot;;  

    notification.textContent = &quot;You are currently offline. Some features may not be available.&quot;;  

    document.body.appendChild(notification);  

}  

}  
function removeOfflineNotification() {  
const notification = $(&#39;#offline-notification&#39;);  

if (notification) {  

    notification.remove();  

}  

}  
// Check offline status on startup  
handleOfflineStatus();  
// Feature: Custom error logging  
window.onerror = function(message, source, lineno, colno, error) {  
console.error(&quot;Custom Error Logger:&quot;, { message, source, lineno, colno, error });  

// In a real app, send this error info to the server  

};  
// End of additional features  
// Debug: Function to log current state of application  
function debugState() {  
console.log(&quot;Current Page:&quot;, currentPage);  

console.log(&quot;Articles per Page:&quot;, articlesPerPage);  

console.log(&quot;News Data Length:&quot;, newsData.length);  

console.log(&quot;Bookmarks:&quot;, bookmarks);  

}  
// Expose debug function to global scope for developers  
window.debugState = debugState;  
// Feature: Deferred loading of non-critical scripts  
function loadDeferredScripts() {  
const script = document.createElement(&#39;script&#39;);  

script.src = &quot;deferred.js&quot;;  

script.async = true;  

document.body.appendChild(script);  

}  
// Call deferred scripts loader after initial load  
loadDeferredScripts();