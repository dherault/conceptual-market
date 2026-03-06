# Conceptual Market

Trading markets exist in various forms, such as stocks, currencies, commodities, bonds, and, more recently, predictions.
This document drafts the possibility of a new kind of market: the conceptual market.

## The exchanged: concepts

In a conceptual market, concepts replace companies. A concept can be “Car” or “Sovereignty”, or “Coca-Cola”. Note that here “Coca-Cola” does not refer to the company, but to the concept of Coca-Cola, the drink. To differentiate between “Orange”, the color, and “Orange”, the fruit, a Wikipedia URL would be attached to the concept. Moreover, a concept graph could be created from the different concepts.

Each concept would have an index. This index would vary based on a volume and sentiment analysis of the ongoing news. For example, if a lot of new articles talk about “Sovereignty”, then the index of that concept would increase, and the index of connected concepts in the graph would increase too, in a lighter way.

## The Oracle: How indexes are computed from world news

The oracle transforms world news into financial values. It ensures that the price of a concept is anchored in reality, and not just in trading. In practice, the oracle would scan a collection of curated RSS feeds to collect articles from the press, exclusively from trusted sources. The RSS feeds would be heavily moderated to prevent any media manipulation, and any news article about conceptual trading would be discarded. Some other precautions would exist to prevent media manipulation and other feedback loops. impacting the indexes.

Then, for each article, the oracle would invoke an LLM (such as Gemini Flash 1.5) to analyse its content. Three variables would be extracted for each identified concept of the article: the magnitude and the salience. The final impact of the article on a concept’s index would then be the product of these two values and a third value representing the authority of the source. The volume of articles would also impact the index, with a logarithmic scale to compensate for high volumes. A low volume of articles would decrease the index.

Index_t = Index_t-5minutes * (1 + Delta)

Delta = sum(articles, Salience * Magnitude * Authority of the source) * ln(Volume + 1) / Volume

Note that the sentiment of the concept in the article is not taken into account on purpose: we want to value loudness, not direction.

The index would never drop to 0, and could be as low as its baseline.

To prevent high-frequency trading, the oracle would use a batching methodology, for example, setting the indexes every five minutes. The trading prices of every concept would then be based on that future index value, thus preventing anticipation of the oracle. For example, a trade initiated at 12:02 would use the index at 12:05 for its final price.

Example:

Marc wants to buy “Sovereignty” at 12:02, when its index is $100, with an order of $1000 i.e. potentially 10 shares. Between 12:00 and 12:05, the oracle increases the index of “Sovereignty” to $110. Then at 12:05, Marc’s order is validated at $1000/$110 = 9.09 shares.

The computations of the indexes would be transparent: for every concept and a given period, the full list of articles used and their impact on the index would be given to the traders.

## The trade

Concepts would be created as soon as a news article mentions them with a high-enough threshold on magnitude and salience. They would then be added to the knowledge graph. Once enough data is collected to compute a first initial index for a concept, a number of shares for that concept would be emitted, and the concept would become tradable. The initial shares would be bought from the platform.

Then, the shares would be traded with buy and sell orders between traders, similar to a bid-ask system. The platform would take a trading fee on these transactions, typically 0.5%.

To prevent the market price from drifting into la-la land (e.g., "Sovereignty" trading at $1,000 while the oracle says it's $100), we would introduce a redemption mechanism:
- If the market price is higher than the oracle index, an arbitrageur can "create" a new share by paying the oracle index value to the platform and immediately sell it on the market.
- If the market price is lower than the oracle index, an arbitrageur can buy the cheap share on the market and "redeem" it for 80% of the oracle index value.
- Every time a share is created via the oracle, a portion of that money must go into a "redemption reserve".

## Transparency and regulation of the platform

Initially, the platform would handle paper money only, to build a community and refine its mechanics, then move on to real financial streams once the regulatory aspects are sorted out.

## The question

What would you change to make this concept a viable startup?
