const refreshButton = document.getElementById('refreshCartButton')
const cartSection = document.getElementById('withCartId')
const cartIdPre = document.getElementById('cartId')
const unsupportedSection = document.getElementById('unsupportedDomain')
const copyCartIdButton = document.getElementById('copyCartId')
const copyIcon = document.getElementById('copyIcon')
// Actions
const openQAButton = document.getElementById('openQA')
const openStageButton = document.getElementById('openStage')
const openCartLocalButton = document.getElementById('openCartLocal')
const openCheckoutLocalButton = document.getElementById('openCheckoutLocal')
// dev branch
const devBranchPageSelect = document.getElementById('devBranchPage')
const devBranchInput = document.getElementById('devBranchInput')
const devBranchSubmit = document.getElementById('devBranchSubmit')

// Centralized configuration constants
const CONFIG = Object.freeze({
    SUPPORTED_SUFFIX: 'tsc-starts-coding.com',
    DOMAINS: Object.freeze({
        qa: 'https://www.saatva-node-qa.tsc-starts-coding.com',
        stage: 'https://www.saatva-node-stage.tsc-starts-coding.com',
        cartLocal: 'https://cart.local',
        checkoutLocal: 'https://checkout.local'
    }),
    ICONS: Object.freeze({
        copy: 'assets/copy.svg',
        check: 'assets/check.svg'
    }),
    MESSAGES: Object.freeze({
        noCart: 'No cart yet. Add an item on the site to generate a cart, then click Refresh.'
    })
})

// --- Promise-based wrappers for chrome.* APIs ---
function getActiveTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs[0]))
    })
}

function getCookie(url, name) {
    return new Promise((resolve) => {
        chrome.cookies.get({ url, name }, (cookie) => resolve(cookie?.value))
    })
}

// Initial state
let cartIdCookie
hide(cartSection)
hide(unsupportedSection)
fetchCartId()

refreshButton.addEventListener('click', () => {
    fetchCartId()
})

async function fetchCartId() {
    setLoading(true)
    try {
        const currentTab = await getActiveTab()
        if (!currentTab?.url) {
            return showUnsupported('No active tab URL available.')
        }
        const activeUrl = new URL(currentTab.url)
        const hostname = activeUrl.hostname
        const supported = hostname.endsWith(CONFIG.SUPPORTED_SUFFIX)
        if (!supported) {
            return showUnsupported(`Unsupported: ${hostname}`)
        }
        cartIdCookie = await getCookie(currentTab.url, 'cartId')
        if (cartIdCookie) {
            cartIdPre.textContent = cartIdCookie
            cartIdPre.dataset.cartid = cartIdCookie
            const help = document.getElementById('noCartHelp')
            if (help) help.style.display = 'none'
        } else {
            cartIdPre.textContent = '(no cart yet)'
            cartIdPre.dataset.cartid = ''
            const help = document.getElementById('noCartHelp')
            if (help) {
                help.textContent = CONFIG.MESSAGES.noCart
                help.style.display = 'block'
            }
        }
        showCart()
        setLinks()
        toggleDisabledState()
    } catch (err) {
        console.error('[popup] fetchCartId error', err)
        showUnsupported('Error retrieving cart ID.')
    } finally {
        setLoading(false)
    }
}

function setLinks() {
    const cartId = cartIdCookie
    const buttons = [
        { el: openQAButton, base: CONFIG.DOMAINS.qa, path: '/cart/' },
        { el: openStageButton, base: CONFIG.DOMAINS.stage, path: '/cart/' },
        { el: openCartLocalButton, base: CONFIG.DOMAINS.cartLocal, path: '/cart/' },
        { el: openCheckoutLocalButton, base: CONFIG.DOMAINS.checkoutLocal, path: '/checkout/' }
    ]
    buttons.forEach(({ el, base, path }) => {
        if (cartId) {
            el.href = `${base}${path}?cartId=${encodeURIComponent(cartId)}`
        } else {
            el.removeAttribute('href')
        }
    })
}

function toggleDisabledState() {
    openQAButton.classList.toggle('button--disabled', !cartIdCookie)
    openStageButton.classList.toggle('button--disabled', !cartIdCookie)
    openCartLocalButton.classList.toggle('button--disabled', !cartIdCookie)
    openCheckoutLocalButton.classList.toggle('button--disabled', !cartIdCookie)
    devBranchSubmit.classList.toggle('button--disabled', !cartIdCookie)
}

function showCart() {
    hide(unsupportedSection)
    show(cartSection)
}

function showUnsupported() {
    cartIdPre.textContent = ''
    hide(cartSection)
    show(unsupportedSection)
    setLoading(false)
}

function setLoading(isLoading) {
    if (isLoading) {
        refreshButton.disabled = true
        refreshButton.classList.add('button--disabled')
        refreshButton.setAttribute('aria-busy', 'true')
    } else {
        refreshButton.disabled = false
        refreshButton.classList.remove('button--disabled')
        refreshButton.removeAttribute('aria-busy')
    }
}

function copyCartIdToClipboard() {
    const cartId = cartIdPre.dataset.cartid
    if (cartId && cartId !== '(no cart yet)') {
        navigator.clipboard.writeText(cartId).then(() => {
            copyIcon.src = CONFIG.ICONS.check
            setTimeout(() => {
                copyIcon.src = CONFIG.ICONS.copy
            }, 2000)
        })
    }
}

// small helpers
function show(el) {
    el.classList.remove('container--hidden', 'hidden')
}
function hide(el) {
    el.classList.add('container--hidden')
}

// Bind copy button
copyCartIdButton.addEventListener('click', () => {
    copyCartIdToClipboard()
})

// Bind dev branch submit
devBranchSubmit.addEventListener('click', () => {
    const branch = devBranchInput.value
    const selectedPage = devBranchPageSelect.value
    if (branch) {
        // Open dev branch URL with cartId
        const url = `https://${selectedPage}-${branch}.saatva.private/${selectedPage}/?cartId=${cartIdCookie}`
        chrome.tabs.create({ url })
    }
})
