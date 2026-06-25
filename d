[33mcommit d961f4e08808a2b5be0158eeb87b3e7f4b9a03e1[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mProduction[m[33m, [m[1;31morigin/Production[m[33m)[m
Author: Ali Gholipour <aligholipourkhalili@gmail.com>
Commit: Ali Gholipour <aligholipourkhalili@gmail.com>

    Fix: change city when cityId exist localstorage

[33mcommit 26d167620ea12b0c7caeb3931f0f9c17b1eef0da[m
Author: Ali Gholipour <aligholipourkhalili@gmail.com>
Commit: Ali Gholipour <aligholipourkhalili@gmail.com>

    Fix: Change city and change event by cityid - login with otp and reset send login otp code

[33mcommit 59d5a1ca9b2bf66551df57e0786818005b7d55fc[m
Author: Ali Gholipour <aligholipourkhalili@gmail.com>
Commit: Ali Gholipour <aligholipourkhalili@gmail.com>

    Fix: handle user logged in when referesh page with localstorage and check use loggedIn in start program

[33mcommit fa41dfe9aee829b194a9e13cbcd322b534fdf2b4[m
Author: Ali Gholipour <aligholipourkhalili@gmail.com>
Commit: Ali Gholipour <aligholipourkhalili@gmail.com>

    Fix: new organizer horizontal scroll

[33mcommit b3330370642cee6be9702f4eacad5be0fff72911[m
Author: Ali Gholipour <aligholipourkhalili@gmail.com>
Commit: Ali Gholipour <aligholipourkhalili@gmail.com>

    Feat: add global base url

[33mcommit 27b945d14f7ea9e2c5ca6fbc18c394ee46f495d8[m
Author: Ali Gholipour <aligholipourkhalili@gmail.com>
Commit: Ali Gholipour <aligholipourkhalili@gmail.com>

    Fix: app user contract and remove static data

[33mcommit 0657cc98da4460714268ac3728fd7ee65ffc99bd[m
Author: Ali Gholipour <aligholipourkhalili@gmail.com>
Commit: Ali Gholipour <aligholipourkhalili@gmail.com>

    Feat: Create servicves and component

[33mcommit 5d5677eef0dca25916014c0a6f36aaf6ce031686[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m, [m[1;32mmain[m[33m)[m
Author: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>
Commit: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>

    feat: Simplify footer visibility logic
    
    Remove complex conditional rendering for the main footer. The footer should now be consistently hidden only when a specific event is selected, simplifying the UI state management. This also adjusts padding for content below the footer.

[33mcommit 6571995d899b21d47bc296945f0756364f8d526e[m
Author: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>
Commit: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>

    feat: Add new icons and types for Dorehami
    
    Introduces a wider range of icons from lucide-react and expands the type definitions for events and categories to include more detailed attributes. This enhances the platform's data modeling capabilities for richer event and user information.

[33mcommit aab3ce3e601d781f38bd2aa31a59e08276cc796c[m
Author: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>
Commit: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>

    feat: Integrate new UI components and libraries
    
    This commit introduces several new libraries and components to enhance the application's user interface and functionality. Key additions include:
    
    - **Rich Text Editing:** Tiptap starter kit and placeholder extension for robust content creation.
    - **Image Cropping:** `react-easy-crop` for user-friendly image manipulation.
    - **Interactive Maps:** `@vis.gl/react-google-maps` for map integration.
    - **Icon Library:** Expanded `lucide-react` usage for a richer icon set.
    - **Animation:** Incorporated `motion` library for smooth UI transitions.
    
    These changes lay the groundwork for more dynamic and interactive features within the Dorehami application.

[33mcommit 3646fcf2abf02ff43e2920872557f887c0e524a4[m
Author: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>
Commit: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>

    feat: Add event details and UI enhancements
    
    Includes new properties for event price, latitude, and longitude.
    Adds several new icons to the lucide-react library.
    Introduces a new `skeleton` utility class for loading states.
    Updates NEARBY_EVENTS_DATA with expanded details for each event.

[33mcommit 60a3859354d06c3a920ae377d66efb9763627571[m
Author: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>
Commit: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>

    feat: Initialize Dorehami event registration app
    
    Sets up the core project structure for the Dorehami event registration platform. Includes:
    - Basic React application setup with Vite and Tailwind CSS.
    - Environment variable configuration for API keys.
    - Essential README and .gitignore files.
    - Initial type definitions for events and categories.
    - Placeholder UI elements and mock data.

[33mcommit 88349de98b15fe9cb1fd4a0e8dc485f3543f9100[m
Author: Ali Gholipour <46029511+aligholipour@users.noreply.github.com>
Commit: GitHub <noreply@github.com>

    Initial commit
