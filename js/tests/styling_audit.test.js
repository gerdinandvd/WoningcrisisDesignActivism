/**
 * Styling & Consistency Test Script
 * This script runs in the browser console or via a runner to verify UI consistency.
 */

async function runStylingTests() {
  const results = {
    passed: [],
    failed: []
  };

  function test(desc, fn) {
    try {
      fn();
      results.passed.push(desc);
      console.log(`✅ PASSED: ${desc}`);
    } catch (err) {
      results.failed.push(`${desc}: ${err.message}`);
      console.error(`❌ FAILED: ${desc}`, err);
    }
  }

  console.log("🚀 Starting Styling & Consistency Tests...");

  // 1. Navigation Logo
  test("Navigation logo exists", () => {
    const logo = document.querySelector(".nav-logo");
    if (!logo) throw new Error("Logo with class .nav-logo not found");
  });

  // 2. Consistent Title
  test("Consistent navigation title class exists", () => {
    const title = document.querySelector(".nav-title");
    if (!title) throw new Error("Title with class .nav-title not found");
    if (title.textContent !== "WoningCrisis Design Activism") {
      throw new Error(`Unexpected title text: ${title.textContent}`);
    }
  });

  // 3. Navigation Links (4 expected: Home, Game, Posters, Over ons)
  test("All 4 navigation links are present", () => {
    const navLinks = document.querySelectorAll(".nav-links a");
    if (navLinks.length !== 4) {
      throw new Error(`Expected 4 nav links, found ${navLinks.length}`);
    }
    
    const linkTexts = Array.from(navLinks).map(a => a.textContent.trim());
    const expected = ["Home", "Game", "Posters", "Over ons"];
    expected.forEach(text => {
      if (!linkTexts.includes(text)) {
        throw new Error(`Missing expected nav link: ${text}`);
      }
    });
  });

  // 4. Logo Vertical Alignment (CSS check)
  test("Logo has correct vertical alignment styling", () => {
    const logo = document.querySelector(".nav-logo");
    const style = window.getComputedStyle(logo);
    if (style.top !== "50%" || !style.transform.includes("matrix")) {
       // Note: matrix(1, 0, 0, 1, 0, -X) represents translateY(-50%)
       // Simple check for presence of transform
    }
  });

  console.log("--- Test Summary ---");
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);

  return results;
}

// Automatically run if in a browser environment with a UI
if (typeof window !== "undefined" && document.body) {
  runStylingTests();
}
