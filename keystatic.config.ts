import { config, fields, collection, singleton } from '@keystatic/core';

// The admin lives at /keystatic. In development it reads and writes the files
// in this repository directly. In production it commits to GitHub through a
// Keystatic GitHub App (see README, "Admin in production").
const GITHUB_OWNER = 'marketing-sol-it';
const GITHUB_REPO = 'sol-website';

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : { kind: 'github', repo: { owner: GITHUB_OWNER, name: GITHUB_REPO } },
  ui: {
    brand: { name: 'oikos Solar' },
    navigation: {
      Content: ['events', 'positions', 'partners', 'team'],
      Pages: ['about', 'settings'],
    },
  },

  collections: {
    events: collection({
      label: 'Events',
      slugField: 'title',
      path: 'src/content/events/*',
      columns: ['date', 'format', 'hidden'],
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        startTime: fields.text({ label: 'Start time', description: 'e.g. 18:15' }),
        endTime: fields.text({ label: 'End time', description: 'e.g. 20:00' }),
        location: fields.text({ label: 'Location', description: 'e.g. HSG Square, Vadiant Gallus' }),
        format: fields.select({
          label: 'Format',
          options: [
            { label: 'Panel', value: 'panel' },
            { label: 'Workshop', value: 'workshop' },
            { label: 'Competition', value: 'competition' },
            { label: 'Community', value: 'community' },
          ],
          defaultValue: 'panel',
        }),
        language: fields.select({
          label: 'Language',
          options: [
            { label: 'English', value: 'EN' },
            { label: 'German', value: 'DE' },
            { label: 'English and German', value: 'EN/DE' },
          ],
          defaultValue: 'EN',
        }),
        description: fields.text({ label: 'Description', multiline: true, description: 'Two to four sentences. Who speaks, what happens, what follows (apéro, pizza).' }),
        partner: fields.text({ label: 'Partner', description: 'Co-host or partner shown as "with …"' }),
        cover: fields.image({ label: 'Cover image', directory: 'public/images/events', publicPath: '/images/events/', description: 'Optional. Landscape, at least 1200 px wide.' }),
        signupUrl: fields.url({ label: 'Sign-up form URL', description: 'Link to the Notion form for this event. Leave empty if no sign-up is needed.' }),
        hidden: fields.checkbox({ label: 'Hidden', description: 'Hide from the site (cancelled or not yet announced).' }),
        recap: fields.text({ label: 'Recap', multiline: true, description: 'Filled in after the event. Two or three lines: what happened, how many came.' }),
        photos: fields.array(
          fields.image({ label: 'Photo', directory: 'public/images/events', publicPath: '/images/events/' }),
          { label: 'Recap photos', itemLabel: () => 'Photo' },
        ),
      },
    }),

    positions: collection({
      label: 'Open positions',
      slugField: 'title',
      path: 'src/content/positions/*',
      columns: ['team', 'open', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Role title', validation: { isRequired: true } } }),
        team: fields.text({ label: 'Team', description: 'e.g. Consulting, Marketing & Events, Finance, Data, Leadership' }),
        description: fields.text({ label: 'Description', multiline: true }),
        hours: fields.text({ label: 'Hours per week', description: 'e.g. 4–6 h/week' }),
        credits: fields.text({ label: 'Credits', description: 'e.g. 4 ECTS or Certificate' }),
        onePager: fields.file({ label: 'One-pager PDF', directory: 'public/files/positions', publicPath: '/files/positions/' }),
        open: fields.checkbox({ label: 'Open', defaultValue: true, description: 'Untick when the role is filled. It stays listed as "Filled".' }),
        order: fields.integer({ label: 'Order', defaultValue: 10 }),
      },
    }),

    partners: collection({
      label: 'Partners',
      slugField: 'name',
      path: 'src/content/partners/*',
      columns: ['showOnHome', 'permissionConfirmed', 'order'],
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        logo: fields.image({ label: 'Logo', directory: 'public/images/partners', publicPath: '/images/partners/', description: 'PNG or SVG with transparent background.' }),
        website: fields.url({ label: 'Website' }),
        kind: fields.select({
          label: 'Kind',
          options: [
            { label: 'Client', value: 'client' },
            { label: 'Sponsor', value: 'sponsor' },
            { label: 'Network', value: 'network' },
          ],
          defaultValue: 'network',
        }),
        showOnHome: fields.checkbox({ label: 'Show on home', defaultValue: true }),
        permissionConfirmed: fields.checkbox({ label: 'Permission confirmed', description: 'The logo goes live only when this is ticked.' }),
        order: fields.integer({ label: 'Order', defaultValue: 10 }),
      },
    }),

    team: collection({
      label: 'Team',
      slugField: 'name',
      path: 'src/content/team/*',
      columns: ['role', 'order'],
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        role: fields.text({ label: 'Role', validation: { isRequired: true } }),
        photo: fields.image({ label: 'Photo', directory: 'public/images/team', publicPath: '/images/team/', description: 'Square, at least 600 px.' }),
        linkedin: fields.url({ label: 'LinkedIn URL' }),
        group: fields.select({
          label: 'Group',
          options: [
            { label: 'Leadership team', value: 'leadership' },
            { label: 'Advisory board', value: 'advisory' },
          ],
          defaultValue: 'leadership',
        }),
        order: fields.integer({ label: 'Order', defaultValue: 10 }),
      },
    }),
  },

  singletons: {
    about: singleton({
      label: 'About page',
      path: 'src/content/about',
      schema: {
        intro: fields.text({ label: 'Headline', description: 'One line under "About".' }),
        story: fields.text({ label: 'Story', multiline: true, description: 'Separate paragraphs with a blank line.' }),
        vision: fields.text({ label: 'Vision sentence' }),
        groupPhoto: fields.image({ label: 'Group photo', directory: 'public/images/about', publicPath: '/images/about/' }),
        groupPhotoCaption: fields.text({ label: 'Group photo caption' }),
      },
    }),

    settings: singleton({
      label: 'Site settings',
      path: 'src/content/settings',
      schema: {
        consultingEmail: fields.text({ label: 'Consulting email', validation: { isRequired: true } }),
        projectHeadEmail: fields.text({ label: 'Project Head email', validation: { isRequired: true } }),
        contactFormUrl: fields.url({ label: 'Contact form URL (Notion)' }),
        applicationUrl: fields.url({ label: 'Application page URL', description: 'The oikos St. Gallen application page or the Notion form.' }),
        linkedin: fields.url({ label: 'LinkedIn URL' }),
        instagram: fields.url({ label: 'Instagram URL' }),
        addressLines: fields.text({ label: 'Postal address', multiline: true }),
        officeNote: fields.text({ label: 'Office note', description: 'e.g. where to find you on campus' }),
        analyticsToken: fields.text({ label: 'Cloudflare Web Analytics token', description: 'Optional. Leave empty to disable analytics.' }),
      },
    }),
  },
});
