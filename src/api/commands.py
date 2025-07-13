import click
from src.api.models import db, User

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.username = f"test_user{x}"
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            user.role = "user"
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass

    @app.cli.command("init-db")
    def init_database():
        """Initialize database tables"""
        try:
            print("Creating database tables...")
            db.create_all()
            print("Database tables created successfully!")
            
            # Create default admin user
            admin_user = User.query.filter_by(username='admin').first()
            if not admin_user:
                admin_user = User(
                    username='admin',
                    email='admin@test.com',
                    password='admin123',
                    is_active=True,
                    role='admin'
                )
                db.session.add(admin_user)
                print("Default admin user created")
            
            # Create default normal user
            normal_user = User.query.filter_by(username='user').first()
            if not normal_user:
                normal_user = User(
                    username='user',
                    email='user@test.com',
                    password='user123',
                    is_active=True,
                    role='user'
                )
                db.session.add(normal_user)
                print("Default normal user created")
            
            db.session.commit()
            print("Default users created successfully!")
            
        except Exception as e:
            print(f"Error initializing database: {str(e)}")
            db.session.rollback()