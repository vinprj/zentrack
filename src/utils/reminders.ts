/**
 * Reminder utilities for habit notifications
 */

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.reject('Notifications not supported');
  }
  
  if (Notification.permission === 'granted') {
    return Promise.resolve('granted');
  }
  
  if (Notification.permission !== 'denied') {
    return Notification.requestPermission();
  }
  
  return Promise.resolve(Notification.permission);
}

export function scheduleNotification(habitName: string, time: string): void {
  if (Notification.permission !== 'granted') return;

  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date(now);
  scheduledTime.setHours(hours, minutes, 0, 0);

  // If time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    showNotification(habitName);
    // Reschedule for next day
    setTimeout(() => scheduleNotification(habitName, time), 24 * 60 * 60 * 1000);
  }, timeUntilNotification);
}

export function showNotification(habitName: string): void {
  if (Notification.permission === 'granted') {
    new Notification('🧘 ZenTrack Reminder', {
      body: `Time to complete: ${habitName}`,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: `habit-${habitName}`,
      requireInteraction: false,
    });
  }
}

export function testNotification(): void {
  showNotification('Sample Habit');
}
