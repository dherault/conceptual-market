# Conceptual Market

Trading markets exist in various forms, such as stocks, currencies, commodities, bonds, and, more recently, predictions.
This document drafts the possibility of a new kind of market: the conceptual market.

## The exchanged: concepts

In a conceptual market, concepts replace companies. A concept can be “Car” or “Sovereignty”, or “Coca-Cola”. Note that here “Coca-Cola” does not refer to the company, but to the concept of Coca-Cola, the drink. To differentiate between “Orange”, the color, and “Orange”, the fruit, a Wikipedia URL would be attached to the concept.
Each concept would have an index. This index would vary based on a volume and sentiment analysis of the ongoing news. For example, if a lot of new articles talk about “Sovereignty”, then the index of that concept would increase.

## The Oracle: How indexes are computed from world news

The oracle transforms world news into financial values. It ensures that the price of a concept is anchored in reality, and not just in trading. In practice, the oracle would scan a collection of RSS feeds to collect articles from the press or blogs. The RSS feeds would be heavily moderated to prevent any media manipulation, and any news article about conceptual trading would be discarded. Some other precautions would exist to prevent media manipulation and other feedback loops. impacting the indexes.

Then, for each article, the oracle would invoke an LLM (such as Gemini Flash 1.5) to analyse its content. Three variables would be extracted for each identified concept of the article: the sentiment score, the magnitude, and the salience. The final impact of the article on a concept’s index would then be the product of these three values and a fourth value representing the authority of the source. The volume of articles would also impact the index, with a logarithmic scale to compensate for high volumes. A low volume of articles would decrease the index.

Index_t = Index_t-5minutes * (1 + Delta)
Delta = sum(articles, Sentiment * Salience * Magnitude * Authority of the source) * ln(Volume + 1) / Volume

To prevent high-frequency trading, the oracle would use a batching methodology, for example, setting the indexes every five minutes. The trading prices of every concept would then be based on that future index value, thus preventing anticipation of the oracle. For example, a trade initiated at 12:02 would use the index at 12:05 for its final price.

Example:
Marc wants to buy “Sovereignty” at 12:02, when its index is $100, with an order of $1000 i.e. potentially 10 shares. Between 12:00 and 12:05, the oracle increases the index of “Sovereignty” to $110. Then at 12:05, Marc’s order is validated at $1000/$110 = 9.09 shares.

The computations of the indexes would be transparent: for every concept and a given period, the full list of articles used and their impact on the index would be given to the traders.

## The trade

In the conceptual market platform, concepts would be “minted”: the platform would emit a number of shares for the concept at a base price. The minting process would take at least a day, enough time to collect the first index value from the oracle to set the initial share price. A moderation process would also take place to ensure minted concepts are valid and tradable. Then the shares would be traded with buy and sell orders between traders, similar to a bid and ask system. The platform would take a trading fee on these transactions, typically 2%.

## The payoff

When a transaction is accepted, part of the platform's fee is accumulated in a pool, each concept having its own pool. If at the end of the period (a week possibly) the index has grown compared to the previous period, then that pool is distributed among the shareholders. So a shareholder is not just betting on a price going up, but also on the velocity of the conversation.

## Transparency of the platform

The plateform's codebase will be open-source. Anyone requesting view-only access to the Google Cloud project will be accepted.

## The question

Why does such a system not exist yet?
