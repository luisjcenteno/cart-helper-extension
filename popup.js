document.addEventListener('DOMContentLoaded', () => {
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

    // Initial state
    let cartIdCookie
    hide(cartSection)
    hide(unsupportedSection)
    fetchCartId()

    refreshButton.addEventListener('click', () => {
        fetchCartId()
    })

    function fetchCartId() {
        setLoading(true)
        // Get active tab and validate domain
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0]
            if (!currentTab?.url) {
                showUnsupported('No active tab URL available.')
                return
            }
            const url = new URL(currentTab.url)
            const hostname = url.hostname
            const supported = hostname.endsWith('tsc-starts-coding.com')
            if (!supported) {
                showUnsupported(`Unsupported: ${hostname}`)
                return
            }

            chrome.cookies.getAll({ domain: hostname }, (cookies) => {
                cartIdCookie = cookies.find((c) => c.name === 'cartId')?.value
                if (cartIdCookie) {
                    cartIdPre.textContent = cartIdCookie
                    cartIdPre.dataset.cartid = cartIdCookie
                    showCart()
                    setLinks()
                } else {
                    cartIdPre.textContent = '(no cart yet)'
                    showCart() // still show section but with placeholder
                }
                setLoading(false)
            })
        })
    }

    function setLinks() {
        openQAButton.href = `https://www.saatva-node-qa.tsc-starts-coding.com/cart/?cartId=${cartIdCookie}`
        openStageButton.href = `https://www.saatva-node-stage.tsc-starts-coding.com/cart/?cartId=${cartIdCookie}`
        openCartLocalButton.href = `https://cart.local/cart/?cartId=${cartIdCookie}`
        openCheckoutLocalButton.href = `https://checkout.local/cart/?cartId=${cartIdCookie}`
    }

    function showCart() {
        hide(unsupportedSection)
        show(cartSection)
    }

    function showUnsupported(msg) {
        cartIdPre.textContent = ''
        hide(cartSection)
        show(unsupportedSection)
        setLoading(false)
    }

    function setLoading(isLoading) {
        if (isLoading) {
            refreshButton.disabled = true
            refreshButton.setAttribute('aria-busy', 'true')
        } else {
            refreshButton.disabled = false
            refreshButton.removeAttribute('aria-busy')
        }
    }

    function copyCartIdToClipboard() {
        const cartId = cartIdPre.dataset.cartid
        if (cartId && cartId !== '(no cart yet)') {
            navigator.clipboard.writeText(cartId).then(() => {
                copyIcon.src = 'assets/copy-check.svg'
                setTimeout(() => {
                    copyIcon.src = 'assets/copy.svg'
                }, 2000)
            })
        }
    }

    // small helpers
    function show(el) { el.classList.remove('container--hidden', 'hidden') }
    function hide(el) { el.classList.add('container--hidden') }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text
        return text.slice(0, maxLength - 3) + '...'
    }

    // Bind copy button
    copyCartIdButton.addEventListener('click', () => {
        copyCartIdToClipboard()
    })

    // Bind dev branch submit
    devBranchSubmit.addEventListener('click', () => {
        const branch = devBranchInput.value
        const selectedPage = devBranchPage.value
        if (branch) {
            // Open dev branch URL with cartId
            const url = `https://${selectedPage}-${branch}.saatva.private/${selectedPage}/?cartId=${cartIdCookie}`
            chrome.tabs.create({ url })
        }
    })
})
