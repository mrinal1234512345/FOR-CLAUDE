import asyncio
from playwright.async_api import async_playwright

async def test_workflow():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        console_errors = []
        page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)
        page.on('pageerror', lambda err: console_errors.append(str(err)))

        print("Navigating to http://localhost:8080/index.html...")
        await page.goto("http://localhost:8080/index.html", wait_until="networkidle")
        await asyncio.sleep(1)

        # Scroll to workflow
        workflow_el = page.locator("#techWorkflow")
        await workflow_el.scroll_into_view_if_needed()
        await asyncio.sleep(0.5)

        # Take screenshot of Dark Mode workflow
        print("Capturing dark mode workflow...")
        await workflow_el.screenshot(path="C:/Users/USER/.gemini/antigravity-ide/brain/f3d9f965-a67f-4981-ad8b-365a4e9ed5f8/workflow_dark.png")

        # Click stage 2 node
        print("Clicking Stage 2 (WebCrypto)...")
        await page.click('.tech-stage-node[data-stage="2"]')
        await asyncio.sleep(0.3)
        inspector_title = await page.inner_text("#inspectorTitle")
        print(f"Inspector Title for Stage 2: {inspector_title}")

        # Click stage 4 node
        print("Clicking Stage 4 (Smart Contract)...")
        await page.click('.tech-stage-node[data-stage="4"]')
        await asyncio.sleep(0.3)
        inspector_title = await page.inner_text("#inspectorTitle")
        print(f"Inspector Title for Stage 4: {inspector_title}")

        # Click Auto-Trace button
        print("Testing Auto-Trace toggle...")
        await page.click("#traceWorkflowBtn")
        await asyncio.sleep(0.5)
        btn_text = await page.inner_text("#traceBtnText")
        print(f"Trace button text: {btn_text}")

        # Switch to Light Mode
        print("Switching to light mode...")
        await page.click("#themeToggle")
        await asyncio.sleep(0.5)

        # Scroll back to workflow
        await workflow_el.scroll_into_view_if_needed()
        await asyncio.sleep(0.5)

        # Take screenshot of Light Mode workflow
        print("Capturing light mode workflow...")
        await workflow_el.screenshot(path="C:/Users/USER/.gemini/antigravity-ide/brain/f3d9f965-a67f-4981-ad8b-365a4e9ed5f8/workflow_light.png")

        # Click stage 5 (IPFS) in light mode
        await page.click('.tech-stage-node[data-stage="5"]')
        await asyncio.sleep(0.3)
        await workflow_el.screenshot(path="C:/Users/USER/.gemini/antigravity-ide/brain/f3d9f965-a67f-4981-ad8b-365a4e9ed5f8/workflow_light_stage5.png")

        # Mobile viewport test
        print("Testing mobile viewport (375x812)...")
        await page.set_viewport_size({'width': 375, 'height': 812})
        await asyncio.sleep(0.5)
        await workflow_el.scroll_into_view_if_needed()
        await asyncio.sleep(0.5)
        await workflow_el.screenshot(path="C:/Users/USER/.gemini/antigravity-ide/brain/f3d9f965-a67f-4981-ad8b-365a4e9ed5f8/workflow_mobile.png")

        print("Console errors:", console_errors)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_workflow())
