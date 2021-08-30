## Final space list

# Install

```bash
yarn
```

# Usage

```bash
yarn dev
```

# Toughts

Because the api list characters with an url to their profile. Instead of loading everytime, at launch i request the full chracter list and make a Map. That way i can just get the id from the url et get the character avoiding more requests.

It's more efficient in the case of that API to load all episodes once. First, because there is only 23 episodes in the list and second because there is no good pagination system. The api only allow limit but no offset in the documentation.

If it was a bigger project, i would either optimize image o use a service to resize on the fly like a cdn, i think cloudflare offer that by default. Right now, the original size of image in the small container makes the loading a bit weird and way too heavy for the size of the images.
