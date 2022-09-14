# optimo-recruitment

Build a simple web crawler in TypeScript/Node JS. Given a starting URL as a parameter, the crawler should visit each URL it finds on the same sub domain - if it is started on bfgames.com it will crawl all the links on bfgames.com but will not follow external links e.g. maps.google.com or clientarea.bfgames.com.

Crawler should produce a text file with each visited URL and links found on that page written below that URL with a single tab indent e.g.

https://bfgames.com/

    https://bfgames.com/games/stunning-cash/

    ...

    https://bfgames.com/about/

    https://clientarea.bfgames.com/

    https://bfgames.com/contact/

...

https://bfgames.com/about/

    https://bfgames.com/wp-content/uploads/2022/05/BF_Games_catalog-1.pdf

https://bfgames.com/contact/

    http://maps.google.com/?q=27%20Old%20Gloucester%20Street,%20London,%20WC1N%203AX

...

Code you write should be production quality.

Covering your solution with tests written in Jest will earn you extra credit.

We are interested in your implementation of the crawling algorithm, therefore, please do not use any scraping frameworks or libraries. Use of libraries handling any other functionalities like logging, http, HTML parsing is not only permitted but strongly encouraged.
