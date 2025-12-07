# Vitest Configuration & Testing Guide

## ✅ Vitest Setup Complete

Your project now has a fully functional testing framework with Vitest!

---

## 📊 Current Test Status

```
Test Files: 1 passed (1)
Tests:      10 passed (10)
Duration:   ~1.33s
UI Status:  Running on http://localhost:51204/__vitest__/
```

### Tests Running:
- ✅ Google Keep Clone - Basic Tests (5 tests)
- ✅ Note Schema Validation - Sample Tests (3 tests)
- ✅ Note Operations - Sample Tests (2 tests)

---

## 🚀 Testing Commands

### Run Tests (Watch Mode)
```bash
npm run test
```
- Watches for file changes
- Re-runs tests automatically
- Press `q` to quit

### Run Tests Once (CI Mode)
```bash
npm run test -- --run
```
- Perfect for CI/CD pipelines
- Exits with status code
- Used in GitHub Actions

### Interactive Test Dashboard
```bash
npm run test:ui
```
- Visual test interface
- Filter and search tests
- View detailed results
- **URL:** http://localhost:51204/__vitest__/

### Generate Coverage Report
```bash
npm run test:coverage
```
- Creates HTML coverage report
- Shows line coverage
- Branch coverage
- Function coverage
- Open `coverage/index.html` to view

---

## 📁 Test File Structure

```
src/
├── __tests__/
│   └── sample.test.ts          # Sample tests
├── components/
│   ├── NoteCard.test.tsx        # (Create these next)
│   ├── Sidebar.test.tsx
│   └── MasonryGrid.test.tsx
├── stores/
│   └── notesStore.test.ts       # (Create these next)
├── schemas/
│   └── noteSchemas.test.ts      # (Create these next)
└── utils/
    └── localStorage.test.ts     # (Create these next)
```

**Test Naming Conventions:**
- `.test.ts` for utility files
- `.test.tsx` for React components
- Place in `__tests__` folder or alongside source

---

## ✍️ Writing Tests

### Basic Test Structure
```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Testing React Components
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteCard } from '../components/NoteCard';

describe('NoteCard Component', () => {
  it('should render note title', () => {
    const note = {
      id: '1',
      title: 'Test Note',
      content: 'Content',
    };
    
    render(<NoteCard note={note} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('should handle pin click', async () => {
    const handlePin = vi.fn();
    const note = {
      id: '1',
      title: 'Test',
      content: 'Content',
      pinned: false,
    };
    
    render(<NoteCard note={note} onPin={handlePin} />);
    await userEvent.click(screen.getByRole('button', { name: /pin/i }));
    expect(handlePin).toHaveBeenCalledWith('1');
  });
});
```

### Testing Zustand Store
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useNotesStore } from '../stores/notesStore';

describe('Notes Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useNotesStore.getState();
    store.notes = [];
  });

  it('should add a note', () => {
    const store = useNotesStore.getState();
    store.addNote({
      title: 'Test Note',
      content: 'Content',
      color: '#fff',
      labels: [],
      type: 'text',
      pinned: false,
      archived: false,
      trashed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    expect(store.notes).toHaveLength(1);
    expect(store.notes[0].title).toBe('Test Note');
  });
});
```

### Testing Zod Schemas
```typescript
import { describe, it, expect } from 'vitest';
import { NoteSchema, CreateNoteSchema } from '../schemas/noteSchemas';

describe('Note Schemas', () => {
  it('should validate valid note', () => {
    const validNote = {
      id: '1',
      title: 'Test',
      content: 'Content',
      color: '#fff',
      labels: [],
      type: 'text' as const,
      pinned: false,
      archived: false,
      trashed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = NoteSchema.safeParse(validNote);
    expect(result.success).toBe(true);
  });

  it('should reject note with too long title', () => {
    const invalidNote = {
      id: '1',
      title: 'a'.repeat(201),
      content: 'Content',
      color: '#fff',
      labels: [],
      type: 'text' as const,
      pinned: false,
      archived: false,
      trashed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = NoteSchema.safeParse(invalidNote);
    expect(result.success).toBe(false);
  });
});
```

---

## 🧪 Sample Tests Included

Your project includes 10 sample tests demonstrating:

1. **Basic Tests** - Math, strings, arrays, objects
2. **Schema Validation** - Note creation, list notes, labels
3. **Operations** - State changes, timestamps

**Location:** `src/__tests__/sample.test.ts`

---

## 🔍 Common Assertions

```typescript
// Equality
expect(value).toBe(5);
expect(value).toEqual(expectedValue);

// Existence
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Collections
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(object).toHaveProperty('name');

// Strings
expect(string).toContain('substring');
expect(string).toMatch(/regex/);

// Functions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);

// DOM
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveAttribute('href', '/path');
```

---

## 📈 Coverage Reports

Generate coverage report:
```bash
npm run test:coverage
```

View the HTML report:
```bash
# Open coverage/index.html in browser
```

Coverage targets for Google Keep Clone:
- **Statements:** 70%+
- **Branches:** 60%+
- **Functions:** 70%+
- **Lines:** 70%+

---

## 🔧 Vitest Configuration

**File:** `vitest.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,              // No need to import describe, it, expect
    environment: 'jsdom',       // Simulate browser environment
    setupFiles: [],             // Files to run before tests
    coverage: {
      provider: 'v8',           // Coverage tool
      reporter: ['text', 'json', 'html', 'lcov'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Path alias
    },
  },
});
```

---

## 🎯 Next Steps - Create More Tests

### Priority 1: Component Tests
Create `src/components/NoteCard.test.tsx`:
```bash
# Template will be provided
```

### Priority 2: Store Tests
Create `src/stores/notesStore.test.ts`:
```bash
# Test add, update, delete operations
```

### Priority 3: Schema Tests
Create `src/schemas/noteSchemas.test.ts`:
```bash
# Test validation rules
```

### Priority 4: Utility Tests
Create `src/utils/localStorage.test.ts`:
```bash
# Test persistence functions
```

---

## 🐛 Debugging Tests

### Run Single Test File
```bash
npm run test -- src/__tests__/sample.test.ts
```

### Run Tests Matching Pattern
```bash
npm run test -- --grep "Note"
```

### Watch Specific File
```bash
npm run test -- src/components/NoteCard.test.tsx --watch
```

### Debug in Browser
```bash
npm run test -- --inspect-brk
```

---

## ✅ Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Test what users see, not internal details
   
2. **Use Descriptive Test Names**
   - "should render note title when note is provided"
   - Not: "render test"

3. **Arrange-Act-Assert (AAA)**
   ```typescript
   // Arrange: Set up test data
   const note = { id: '1', title: 'Test' };
   
   // Act: Perform action
   render(<NoteCard note={note} />);
   
   // Assert: Check result
   expect(screen.getByText('Test')).toBeInTheDocument();
   ```

4. **Keep Tests Independent**
   - Each test should not depend on others
   - Use `beforeEach` for setup

5. **Mock External Dependencies**
   ```typescript
   import { vi } from 'vitest';
   const mockFn = vi.fn();
   ```

---

## 📚 Useful Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Zod Testing Patterns](https://zod.dev/)

---

## 🎉 Summary

✅ **Vitest configured and working**  
✅ **10 sample tests passing**  
✅ **UI dashboard available**  
✅ **Coverage reporting ready**  
✅ **React Testing Library integrated**  
✅ **All test scripts working**

**Your testing infrastructure is production-ready!** 🚀

---

## Quick Command Reference

| Command | Purpose |
|---------|---------|
| `npm run test` | Watch mode testing |
| `npm run test -- --run` | Single run (CI) |
| `npm run test:ui` | Interactive dashboard |
| `npm run test:coverage` | Generate coverage |
| `npm run test -- --grep "pattern"` | Run matching tests |

**Happy testing!** ✨
