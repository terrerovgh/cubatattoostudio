
from playwright.sync_api import sync_playwright

def verify_chat_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Go to the local server
            page.goto("http://localhost:4321")

            # Wait for the chat toggle button to be visible
            toggle_btn = page.locator('button[aria-label="Toggle Assistant"]')
            toggle_btn.wait_for(state="visible", timeout=10000)

            # Verify aria-expanded is false initially
            expanded_state = toggle_btn.get_attribute("aria-expanded")
            print(f"Initial aria-expanded: {expanded_state}")
            if expanded_state != "false":
                print("Error: Initial aria-expanded should be 'false'")

            # Click the toggle button to open chat
            toggle_btn.click()

            # Wait for chat window
            page.wait_for_selector('div[role="log"]', state="visible")

            # Verify aria-expanded is true
            expanded_state = toggle_btn.get_attribute("aria-expanded")
            print(f"After click aria-expanded: {expanded_state}")
            if expanded_state != "true":
                print("Error: aria-expanded should be 'true' after click")

            # Check for input aria-label
            input_field = page.locator('input[aria-label="Chat input"]')
            if input_field.count() > 0:
                print("Found input with aria-label='Chat input'")
            else:
                print("Error: Input with aria-label='Chat input' not found")

            # Check for send button aria-label
            send_btn = page.locator('button[aria-label="Send message"]')
            if send_btn.count() > 0:
                print("Found send button with aria-label='Send message'")
            else:
                 print("Error: Send button with aria-label='Send message' not found")

            # Check structured data
            script = page.locator('script[type="application/ld+json"]')
            content = script.text_content()
            if "TattooParlor" in content and "Cuba Tattoo Studio" in content:
                 print("Found structured data with TattooParlor")
            else:
                 print("Error: Structured data not found or incorrect")

            # Take a screenshot
            page.screenshot(path="verification/accessibility_check.png")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_chat_accessibility()
