from django.test import TestCase
from django.urls import reverse


class DashboardViewsTestCase(TestCase):
    def test_dashboard_redirects_if_anonymous(self):
        """
        Unauthenticated requests to the dashboard should redirect to login.
        """
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.url.startswith('/login/'))

    def test_legacy_dashboard_redirects_if_anonymous(self):
        """
        Legacy DashBoardSocial path should also redirect to login.
        """
        response = self.client.get(reverse('dashboard_legacy'))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.url.startswith('/login/'))

    def test_cadunico_stats_api_requires_login(self):
        """
        Unauthenticated requests to the CADUNICO API should return 401.
        """
        response = self.client.get(reverse('cadunico_stats_api'))
        self.assertEqual(response.status_code, 401)
        self.assertJSONEqual(response.content, {'error': 'Unauthorized'})

    def test_atendimentos_chart_api_requires_login(self):
        """
        Unauthenticated requests to the Atendimentos chart API should return 401.
        """
        response = self.client.get(reverse('atendimentos_chart_api'))
        self.assertEqual(response.status_code, 401)
        self.assertJSONEqual(response.content, {'error': 'Unauthorized'})
