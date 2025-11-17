"""
Debug date extraction for oxu.az
"""

import sys
import os
import asyncio

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sources.oxu_az import OxuAzScraper


async def debug_date():
    """Debug date parsing"""
    test_url = "https://oxu.az/iqtisadiyyat/baliq-bazarinda-canlanma-en-cox-alinan-novler-aciqlandi"

    async with OxuAzScraper() as scraper:
        soup = await scraper.fetch_page(test_url)

        if soup:
            print("Looking for date element...")
            print("=" * 60)

            # Check for date in .post-detail-meta
            date_elems = soup.select('.post-detail-meta span')
            if date_elems:
                print(f"Found {len(date_elems)} span elements in .post-detail-meta:")
                for i, elem in enumerate(date_elems, 1):
                    print(f"  {i}. {elem.get_text()}")

            print("\n" + "=" * 60)
            print("Testing date parsing with found text...")

            if date_elems and len(date_elems) > 0:
                first_date_text = scraper.clean_text(date_elems[0].get_text())
                print(f"First span text: '{first_date_text}'")
                parsed = scraper.parse_date(first_date_text)
                print(f"Parsed result: {parsed}")


if __name__ == "__main__":
    asyncio.run(debug_date())
