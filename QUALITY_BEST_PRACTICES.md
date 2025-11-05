# Website Quality Best Practices

## 10 Core Principles for Andrew Hundt's Academic Website

### 1. **Factual Accuracy Above All**
- Every publication citation must be verified against original sources
- Author names must be complete and in correct order
- Venues, dates, and DOIs must be accurate
- No speculation or assumptions - when uncertain, verify

### 2. **Preserve Author's Voice and Style**
- Use straightforward, factual language
- Avoid superlatives and promotional language
- Let achievements speak for themselves
- Maintain professional, objective tone
- No unnecessary adjectives

### 3. **Complete Information**
- Include full author lists (not "et al." unless original has 10+ authors)
- Provide proper venue names and years
- Include DOIs and URLs where available
- Don't abbreviate critical information

### 4. **Visual Hierarchy and Readability**
- Clear heading structure (h1 → h2 → h3)
- Adequate whitespace between sections
- Consistent formatting throughout
- Easy-to-scan publication lists
- Professional typography

### 5. **Accessibility First**
- Semantic HTML structure
- Proper heading hierarchy
- Descriptive link text
- Alt text for images
- Keyboard navigation support
- Sufficient color contrast

### 6. **Link Integrity**
- All links must work correctly
- Prefer permanent identifiers (DOIs, arXiv IDs)
- External links should be verified
- Internal navigation must be functional
- Use HTTPS where available

### 7. **Responsive Design**
- Test at multiple screen widths (320px, 768px, 1024px, 1440px)
- Ensure mobile readability
- Images should scale appropriately
- Navigation should work on all devices
- Touch targets should be appropriately sized

### 8. **Performance and Load Times**
- Minimize page weight
- Optimize images
- Efficient CSS
- Fast initial render
- No unnecessary JavaScript

### 9. **Professional Presentation**
- Clean, uncluttered design
- Consistent spacing and alignment
- Professional color scheme
- Clear visual organization
- Focus on content over decoration

### 10. **Continuous Verification**
- Test every change
- Verify content after each update
- Cross-check facts regularly
- Review entire page flow
- Ensure no regressions

## Testing Methodology

### For Each Change:
1. Make modification
2. Build locally
3. Test with Playwright
4. Verify visually
5. Check all affected links
6. Validate content accuracy
7. Test responsive behavior
8. Commit only when verified

### Iteration Process:
1. Identify issues
2. Prioritize by severity
3. Fix systematically
4. Re-test completely
5. Document changes
6. Repeat until quality standards met
