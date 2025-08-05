#!/bin/bash

# Remove console.log statements from CartPanel.tsx
sed -i '' '/console\.log/d' /Users/ashokparmar/flickmax/components/cart/CartPanel.tsx

# Remove console.log statements from useCart.ts
sed -i '' '/console\.log/d' /Users/ashokparmar/flickmax/hooks/useCart.ts

# Remove console.log statements from client-cart.ts
sed -i '' '/console\.log/d' /Users/ashokparmar/flickmax/lib/api/client-cart.ts

echo "Console.log statements removed"