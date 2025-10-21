document.addEventListener('DOMContentLoaded', function () {
    const actionButton = document.getElementById('actionButton')
    const messageDiv = document.getElementById('message')
    const cartInfoDiv = document.getElementById('cartInfo')
    const cartIdValue = document.getElementById('cartIdValue')

    // Automatically check for cookie when popup opens
    checkForCartId()

    // Button click handler for manual refresh
    actionButton.addEventListener('click', function () {
        checkForCartId()
    })

    function checkForCartId() {
        // Show loading state
        actionButton.textContent = 'Refreshing...'
        actionButton.disabled = true
        hideCartInfo()
        hideMessage()


        // Check current tab domain and get cookies
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0]
            const url = new URL(currentTab.url)
            const hostname = url.hostname

            // Check if current domain matches *.tsc-starts-coding.com pattern
            if (!hostname.endsWith('tsc-starts-coding.com')) {
                resetButton()
                showMessage(
                    `Error: Current domain "${hostname}" does not match *.tsc-starts-coding.com`,
                    'error'
                )
                return
            }

            // Get cookies for the matching domain
            chrome.cookies.getAll(
                {
                    domain: hostname
                },
                function (cookies) {
                    resetButton()

                    // Look for cartId cookie
                    const cartIdCookie = cookies.find((cookie) => cookie.name === 'cartId')

                    if (cartIdCookie) {
                        // Display cart information
                        cartIdValue.textContent = cartIdCookie.value
                        showCartInfo()
                        showMessage('Cart ID found successfully!', 'success')

                        generateActionList()
                    } else {
                        showMessage('Cart ID cookie not found on this domain.', 'error')
                    }
                }
            )
        })
    }

    function generateActionList() {
        const cartActionList = document.getElementById('cart-action-list')
        const checkoutActionList = document.getElementById('checkout-action-list')
        cartActionList.innerHTML = '' // Clear existing items
        checkoutActionList.innerHTML = '' // Clear existing items

        // Add new action items
        const cartId = cartIdValue.textContent
        if (cartId) {
            // Links for cart actions
            const cartListItem = document.createElement('li')
            cartListItem.innerHTML = `<a href="https://cart.local/cart?cartId=${cartId}" target="_blank">Open cart in Local</a>`
            cartActionList.appendChild(cartListItem)

            // Links for checkout actions
            const checkoutListItem = document.createElement('li')
            checkoutListItem.innerHTML = `<a href="https://checkout.local/checkout?cartId=${cartId}" target="_blank">Open checkout in Local</a>`
            checkoutActionList.appendChild(checkoutListItem)
        }
    }

    function resetButton() {
        actionButton.textContent = 'Refresh'
        actionButton.disabled = false
    }

    function showMessage(text, type = 'success') {
        messageDiv.textContent = text
        messageDiv.className = `message ${type}`
        messageDiv.classList.remove('hidden')

        // Hide message after 5 seconds for success, keep error messages visible
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.classList.add('hidden')
            }, 5000)
        }
    }

    function hideMessage() {
        messageDiv.classList.add('hidden')
    }

    function showCartInfo() {
        cartInfoDiv.classList.remove('hidden')
    }

    function hideCartInfo() {
        cartInfoDiv.classList.add('hidden')
    }
})
